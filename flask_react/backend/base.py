from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from pymongo import GEOSPHERE
import requests
import urllib.parse
import uuid
import openai
import oneai

#from typing_extensions import dataclass_transform
oneai.api_key = "8c26ffde-bffa-44a7-bb1a-551640540ba3"



app = Flask(__name__)
conn="mongodb://localhost:27017"
col=object()
client=object()
db=object()
officials=['offc123']
cache={
    'summary' : ""
}
#openai.api_key= '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'
openai.api_key='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'
def getCoor(lat,long):
    locData=dict()
    locData['type']='Point'
    locData['coordinates'] = [float(long),float(lat)]
    return locData


@app.route('/createProject', methods=['POST'])
def createProject():
    req=request.json

    #get lat,long from address

    add=req['address']
    url='https://nominatim.openstreetmap.org/search/{addr}?format=json'
    url=url.replace('{addr}',add)
    servResp=requests.get(url).json()


    coor=getCoor(servResp[0]['lat'],servResp[0]['lon'])
    req['location']=coor
    if req['layerId'] is None:
        req['layerId'] = str(uuid.uuid4())
        layer=db['layerMeta']
        layerDat={'_id':req['layerId'],'userId':req['userId'],'supports':0,
                          'savedBy':[req['userId']],'saves':0, 'layerName':req['layerName'], 'city':req['city']}

        if req['userId'] in officials:
            layerDat['score']=5
        else:
            layerDat['score']=1

        layer.insert_one(layerDat)


    if col.insert_one(req):
        return jsonify({'lat':servResp[0]['lat'],'long':servResp[0]['lon'],'layerId':req['layerId']})

def transform(results):
    pins=[]
    for result in results:
        pin=result
        pin['lat']=result['location']['coordinates'][1]
        pin['long']=result['location']['coordinates'][0]

        pin.pop('location')
        pins.append(pin)

    return pins

@app.route('/getAggregateMap')
def aggreagateMap():
    print(client)
    db=client['hackDavis']
    collection = db['Projects']
    collection.create_index([("location", GEOSPHERE)])

    # Define the target geospatial point
    target_point = {
        "type": "Point",
        "coordinates": [float(request.args.get('long')),float(request.args.get('lat'))]
    }

    # Perform the query to find points close to the target point
    query = {
        "location": {
            "$near": {
                "$geometry": target_point,
                "$maxDistance": 10
            }
        }
    }

    result=collection.find(query,{'_id':0})
    #transform
    results=transform(result)
    return jsonify({'pins': results})

@app.route('/getLayer')
def getLayer():

    if request.args.get('layerId'):
        results=col.find({'layerId':request.args.get('layerId')},{"_id":0})
        results=transform(results)

    return jsonify({'pins':results})

@app.route('/getLayers')
def getLayers():
    layer=db['layerMeta']
    if request.args.get('userId'):
        projection = {
            'layerName': 1,
            'layerId': '$_id',
            '_id': 0,
            'userId':1
        }

        query = {'savedBy':{'$in':[request.args.get('userId')]}}


        # Perform the aggregation pipeline with the query and projection
        result = layer.aggregate([
            {'$match': query},
            {'$project': projection}
        ])

        results=[ele for ele in result]
        return jsonify(results)

@app.route('/support',methods=['PATCH'])
def supportLayer():
    layer=db['layerMeta']
    req=request.json
    if req['layerId']:
        query={'_id':req['layerId']}
        req = layer.find_one(query)
        score = (0.8 * (req['saves'])) + (0.2 * (1+req['supports']))
        update = {'$inc': {'supports': 1},'$set':{'score':score}}

        layer.update_one(query,update)

    return make_response()

@app.route('/save',methods=['PATCH'])
def saveLayer():
    req=request.json
    if req['layerId'] and req['userId']:
        layer=db['layerMeta']
        query={
            '_id':req['layerId']
        }
        req=layer.find_one(query)
        sc= req['score'] if 'score' in req else 0
        score=(0.8 * (req['saves']+1)) + (0.2 * req['supports']) + sc
        update={'$push':{'savedBy':req['userId']},'$inc':{'saves':1}, '$set':{'score':score}}
        layer.update_one(query,update)
    return make_response()


@app.route('/getFeatured', methods=['GET'])
def getTopPicks():
    #get top
    layer=db['layerMeta']
    cur=layer.find()
    results=[ele for ele in cur]
    results=[ele for ele in results if 'score' in ele]
    topPicks = sorted(results, key=lambda x: x['score'])[:10]
    return jsonify(topPicks)


###########chat with gpt################

def chat_with_gpt(prompt):
    # Define the system message to set the behavior of the model
    system_message = "You are a helpful assistant."

    # Generate a response from the ChatGPT model
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
    )

    # Extract and return the reply from the model's response
    reply = response['choices'][0]['message']['content']
    return reply

def chatOneAI(prompt):
    pipeline = oneai.Pipeline(
        steps=[
            oneai.skills.Summarize(),
        ]
    )

    output = pipeline.run(prompt)
    return output.summary.text




@app.route('/getTagline', methods=['GET'])
def getTag():
    #integrate chat-gpt
    prompt=''
    projects=db['Projects']
    cur=projects.find()
    num=0
    for project in cur:
        if 'description' in project:
            num+=1
            prompt+=str(num)+". "+project['description']+' '

    prompt='summarize all this: '+prompt+' in 20 words'
    response=chat_with_gpt(prompt)
    print(response)
    return jsonify(response)




if __name__ == '__main__':
    client=MongoClient(conn)
    db = client['hackDavis']
    col = db['Projects']
    app.run(debug=True, port=8000)