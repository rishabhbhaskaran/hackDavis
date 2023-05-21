from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from pymongo import GEOSPHERE
import requests
import urllib.parse
import uuid

app = Flask(__name__)
conn="mongodb://localhost:27017"
col=object()
client=object()


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

#top picks

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
                "$maxDistance": 50000
            }
        }
    }

    result=collection.find(query,{'_id':0})
    #transform
    results=transform(result)

    return jsonify({'pins':results})

@app.route('/getLayer')
def getLayer():

    if request.args.get('layerId'):
        results=col.find({'layerId':request.args.get('layerId')},{"_id":0})
        results=transform(results)

    return jsonify({'pins':results})

@app.route('/getLayers')
def getLayers():
    if request.args.get('userId'):
        projection = {
            'layerName': 1,
            'layerId': 1,
            '_id': 0
        }

        results=[ele for ele in col.find({'userId':request.args.get('userId')},projection)]
        return jsonify(results)

if __name__ == '__main__':
    client=MongoClient(conn)
    db = client['hackDavis']
    col = db['Projects']
    app.run(debug=True, port=8000)