import xmltodict
import pickle
import json
import os


def printFirst10Points(docDict):
	for x in range(10):
		print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"]["Samples"]["PathPosition"][x]["@timestamp"]),
		print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"]["Samples"]["PathPosition"][x]["#text"])

		#print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Samples"]["PathPosition"][x]["@timestamp"]),
		#print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Samples"]["PathPosition"][x]["#text"])
def savePointToJsonFile(docDict):
	f = open("Points3.json", "w")
	f.write('{ "pathPoints" : [\n')
	for p in docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"]["Samples"]["PathPosition"]:
	#for p in docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Samples"]["PathPosition"]:
		#print( "time, x, y, z:" )
		#print(p["@timestamp"])
		#print(p["#text"])
		f.write('{ "time":')
		#probably want to convert to a single sec digit
		f.write(timeToSec(p["@timestamp"]))
		x,y,z = splitTextToXYZ(p["#text"])
		f.write(', "x":{},"y":{},"z":{}}},\n'.format(x,y,z))
	print("Hey Oboy, remember to replace the last , in the file with a }")

def savePointToFile(docDict):
	f = open("3js/Points3.js", "w")
	f.write("var pathPoints = [\n")
	for p in docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"]["Samples"]["PathPosition"]:
	#for p in docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Samples"]["PathPosition"]:
		#print( "time, x, y, z:" )
		#print(p["@timestamp"])
		#print(p["#text"])
		f.write('{ "time":')
		#probably want to convert to a single sec digit
		f.write(timeToSec(p["@timestamp"]))
		x,y,z = splitTextToXYZ(p["#text"])
		f.write(', "x":{},"y":{},"z":{}}},\n'.format(x,y,z))
	
def splitTextToXYZ(string):
	spl = string.split(" ")
	if len(spl) == 3:
		return spl
	else:
		return [0,0,0] #something went wrong

def timeToSec(time):
	spl = time.split("T")
	#date = spl[0]
	h,m,s = spl[1].split(":")
	H = float(h) * 60 * 60
	M = float(m) * 60
	S = float(s[:-1])
	return str(H + M + S)



print("hello")

#f = open("sample(1).xml")
#f = open("iteration3_10_ms.xml")
f = open("hi_def_moldy_final.xml")
#print(f.readline())
docDict = xmltodict.parse(f.read())

#savePointToFile(docDict)
savePointToJsonFile(docDict)
#printFirst10Points(docDict)

'''
""" 	How the XMLDict is set up.  """

""" 	Getting the dataItemId = "B1actm" inside the first angle  """
print( "First Angle dataItemId" )
print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][0]["Samples"]["Angle"][0]["@dataItemId"])

print( "First Angle" )
print(docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][0]["Samples"]["Angle"])


"""                                                                              |
	Getting the first path position                     Not sure why this is three V """
print( "first path position" )
print( docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Samples"]["PathPosition"][1]["#text"] )
#PathPosition[0] is UNAVAIBLE, not sure why


""" 	Get the first Block Number  """
print( "first block number" )
print( docDict["MTConnectStreams"]["Streams"]["DeviceStream"]["ComponentStream"][3]["Events"]["e:BlockNumber"][0] )

printFirst10Points(docDict)
'''
#pickle.dump( docDict, open("PickledXML.p", "wb") )

#json.dumps(docDict, open("pySampJSON.json", "wb"), skipkeys = True)
