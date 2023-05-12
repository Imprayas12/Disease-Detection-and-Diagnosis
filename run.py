import sys
import json
import pandas as pd
import pickle
model = pickle.load(open('model.pkl','rb'))
data_dict = json.loads(sys.argv[1])
df = pd.DataFrame.from_dict(data_dict, orient='index').T
ans = model.predict(df)
dum = 0
ret = {}

for i in ans:
    ret["disease"] = i
with open("result.json", "w") as outfile:
    json.dump(ret, outfile)


