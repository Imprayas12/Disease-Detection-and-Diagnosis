import numpy as np
import pandas as pd
import warnings
from sklearn.ensemble import RandomForestClassifier
import pickle
warnings.filterwarnings('ignore')

test = pd.read_csv('Testing.csv')
train = pd.read_csv('Training.csv')
df = pd.concat([test, train])

df.rename(columns={'spotting_ urination':'spotting_urination','foul_smell_of urine':'foul_smell_of_urine','toxic_look_(typhos)':'toxic_look_Or_typhos','dischromic _patches':'dischromic_patches','fluid_overload.1':'fluid_overload_1'}, inplace=True)
df = df.drop('Unnamed: 133', axis=1)
Y = df['prognosis']
X = df.drop('prognosis', axis=1)


rfc = RandomForestClassifier()
rfc.fit(X, Y)


pickle.dump(rfc, open('model.pkl','wb'))
model = pickle.load(open('model.pkl','rb'))



