from flask import Flask

app = Flask(__name__)

@app.route('/getAggregateMap')
def aggreagateMap():
    dict={}
    pins=list()
    pin={}
    pin["lat"]=38.537820
    pin["long"]=-121.751360
    data={}
    data["desc"]="Testing"
    pin["data"]=data
    pins.append(pin)
    dict["pins"]=pins
    return dict

if __name__ == '__main__':
    app.run(debug=True, port=8000)