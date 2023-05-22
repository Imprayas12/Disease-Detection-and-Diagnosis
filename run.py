def install_and_import(package):
    import importlib
    try:
        importlib.import_module(package)
    except ImportError:
        import pip
        pip.main(['install', package])
    finally:
        globals()[package] = importlib.import_module(package)


install_and_import('pandas')
import sys
import json
import pickle
model = pickle.load(open('model.pkl','rb'))
data_dict = json.loads(sys.argv[1])
df = pandas.DataFrame.from_dict(data_dict, orient='index').T
ans = model.predict(df)
dum = 0
ret = {}

for i in ans:
    ret["disease"] = i
with open("result.json", "w") as outfile:
    json.dump(ret, outfile)


