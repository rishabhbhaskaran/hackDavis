from flask import Flask

app = Flask(__name__)

@app.route('/getAgreggateMap')
def aggreagateMap():
    dict={}
    pins=list()
    pin={}
    pin["lat"]=1234
    pin["long"]=5678
    data={}
    data["desc"]="Testing"
    pin["data"]=data
    pins.append(pin)
    dict["pins"]=pins
    return dict

if __name__ == '__main__':
    app.run(debug=True, port=8000)