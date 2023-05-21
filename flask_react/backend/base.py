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
    if 'layerId' not in req:
        req['layerId'] = str(uuid.uuid4())

    if col.insert_one(req):
        return jsonify({'lat':servResp[0]['lat'],'long':servResp[0]['lon'],'layerId':req['layerId']})

def transform(results):
    pins=[]
    for result in results:
        pin={'lat':result['location']['coordinates'][1],
             'long': result['location']['coordinates'][0]}
        if 'data' in result:
            pin['data'] = result['data']
        else:
            pin['data']={}

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
                "$maxDistance": 50000
            }
        }
    }

    result=collection.find(query)
    #transform
    results=transform(result)

    return jsonify({'pins':results})

@app.route('/getLayers')
def getLayers():
    if request.args.get('userId'):
        results=col.find({'userId':request.args.get('userId')})
            

if __name__ == '__main__':
    client=MongoClient(conn)
    db = client['hackDavis']
    col = db['Projects']
    app.run(debug=True, port=8000)