const express = require('express')
const path = require('path')
const app = express()
const PORT = 8880
const fs = require('fs')
const session = require('express-session')
const { PythonShell } = require('python-shell')
app.use(express.static(path.join(__dirname, 'views')))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))


const diseases = [
    "itching",
    "skin_rash",
    "nodal_skin_eruptions",
    "continuous_sneezing",
    "shivering",
    "chills",
    "joint_pain",
    "stomach_pain",
    "acidity",
    "ulcers_on_tongue",
    "muscle_wasting",
    "vomiting",
    "burning_micturition",
    "spotting_urination",
    "fatigue",
    "weight_gain",
    "anxiety",
    "cold_hands_and_feets",
    "mood_swings",
    "weight_loss",
    "restlessness",
    "lethargy",
    "patches_in_throat",
    "irregular_sugar_level",
    "cough",
    "high_fever",
    "sunken_eyes",
    "breathlessness",
    "sweating",
    "dehydration",
    "indigestion",
    "headache",
    "yellowish_skin",
    "dark_urine",
    "nausea",
    "loss_of_appetite",
    "pain_behind_the_eyes",
    "back_pain",
    "constipation",
    "abdominal_pain",
    "diarrhoea",
    "mild_fever",
    "yellow_urine",
    "yellowing_of_eyes",
    "acute_liver_failure",
    "fluid_overload",
    "swelling_of_stomach",
    "swelled_lymph_nodes",
    "malaise",
    "blurred_and_distorted_vision",
    "phlegm",
    "throat_irritation",
    "redness_of_eyes",
    "sinus_pressure",
    "runny_nose",
    "congestion",
    "chest_pain",
    "weakness_in_limbs",
    "fast_heart_rate",
    "pain_during_bowel_movements",
    "pain_in_anal_region",
    "bloody_stool",
    "irritation_in_anus",
    "neck_pain",
    "dizziness",
    "cramps",
    "bruising",
    "obesity",
    "swollen_legs",
    "swollen_blood_vessels",
    "puffy_face_and_eyes",
    "enlarged_thyroid",
    "brittle_nails",
    "swollen_extremeties",
    "excessive_hunger",
    "extra_marital_contacts",
    "drying_and_tingling_lips",
    "slurred_speech",
    "knee_pain",
    "hip_joint_pain",
    "muscle_weakness",
    "stiff_neck",
    "swelling_joints",
    "movement_stiffness",
    "spinning_movements",
    "loss_of_balance",
    "unsteadiness",
    "weakness_of_one_body_side",
    "loss_of_smell",
    "bladder_discomfort",
    "foul_smell_of_urine",
    "continuous_feel_of_urine",
    "passage_of_gases",
    "internal_itching",
    "toxic_look_Or_typhos",
    "depression",
    "irritability",
    "muscle_pain",
    "altered_sensorium",
    "red_spots_over_body",
    "belly_pain",
    "abnormal_menstruation",
    "dischromic_patches",
    "watering_from_eyes",
    "increased_appetite",
    "polyuria",
    "family_history",
    "mucoid_sputum",
    "rusty_sputum",
    "lack_of_concentration",
    "visual_disturbances",
    "receiving_blood_transfusion",
    "receiving_unsterile_injections",
    "coma",
    "stomach_bleeding",
    "distention_of_abdomen",
    "history_of_alcohol_consumption",
    "fluid_overload_1",
    "blood_in_sputum",
    "prominent_veins_on_calf",
    "palpitations",
    "painful_walking",
    "pus_filled_pimples",
    "blackheads",
    "scurring",
    "skin_peeling",
    "silver_like_dusting",
    "small_dents_in_nails",
    "inflammatory_nails",
    "blister",
    "red_sore_around_nose",
    "yellow_crust_ooze"
]

const treatment = {
    "Fungal infection": ["Antifungal medication", "Keeping the affected area dry and clean"],
    "Hepatitis C": ["Antiviral medication", "Liver transplant in severe cases"],
    "Hepatitis E": ["Rest and hydration", "Avoiding alcohol and fatty foods"],
    "Alcoholic hepatitis": ["Stopping alcohol consumption", "Medication to reduce liver inflammation"],
    "Tuberculosis": ["Antibiotics for several months", "Rest and good nutrition"],
    "Common Cold": ["Rest and hydration", "Over-the-counter cold medication"],
    "Pneumonia": ["Antibiotics", "Rest and good nutrition"],
    "Dimorphic hemmorhoids(piles)": ["Increased fiber and fluids in diet", "Topical creams or suppositories"],
    "Heart attack": ["Aspirin to prevent blood clots", "Nitroglycerin to improve blood flow to the heart"],
    "Varicose veins": ["Compression stockings", "Elevating the legs when possible"],
    "Hypothyroidism": ["Levothyroxine to replace missing thyroid hormone", "Regular thyroid function tests"],
    "Hyperthyroidism": ["Antithyroid medication", "Radioactive iodine therapy"],
    "Hypoglycemia": ["Eating small, frequent meals", "Monitoring blood sugar levels"],
    "Osteoarthristis": ["Pain relief medication", "Physical therapy"],
    "Arthritis": ["Pain relief medication", "Exercise and physical therapy"],
    "(vertigo) Paroymsal  Positional Vertigo": ["Epley maneuver to reposition loose particles in the ear", "Medication for nausea and dizziness"],
    "Acne": ["Topical creams or gels", "Oral antibiotics in severe cases"],
    "Urinary tract infection": ["Antibiotics", "Drinking plenty of fluids"],
    "Psoriasis": ["Topical creams or ointments", "Light therapy"],
    "Hepatitis D": ["Vaccination for hepatitis B to prevent coinfection", "Antiviral medication"],
    "Hepatitis B": ["Antiviral medication", "Liver transplant in severe cases"],
    "Allergy": ["Antihistamines", "Avoiding allergens"],
    "Hepatitis A": ["Rest and hydration", "Avoiding alcohol and fatty foods"],
    "GERD": ["Antacids or acid-reducing medications", "Avoiding trigger foods"],
    "Chronic cholestasis": ["Ursodeoxycholic acid to improve bile flow", "Monitoring liver function"],
    "Drug Reaction": ["Discontinuing the offending medication", "Treating symptoms such as rash or swelling"],
    "Peptic ulcer diseae": ["Antibiotics to treat H. pylori infection", "Acid-reducing medication"],
    "AIDS": ["Antiretroviral medication", "Preventing opportunistic infections"],
    "Diabetes": ["Blood sugar monitoring", "Insulin or oral medication"],
    "Gastroenteritis": ["Rest and hydration", "Avoiding solid foods until symptoms improve"],
    "Bronchial Asthma": ["Bronchodilators to open airways", "Steroid medication to reduce inflammation"],
    "Hypertension": ["Lifestyle changes such as diet and exercise", "Antihypertensive medication"],
    "Migraine": ["Pain relief medication", "Avoiding triggers such as stress or certain foods"],
    "Cervical spondylosis": ["Physical therapy to improve neck strength and range of motion", "Pain relief medication"],
    "Paralysis (brain hemorrhage)": ["Rehabilitation therapy such as physical and occupational therapy", "Speech therapy in case of speech impairment"],
    "Jaundice": ["Rest and hydration", "Treating underlying conditions such as viral hepatitis"],
    "Malaria": ["Antimalarial medication", "Rest and hydration"],
    "Chicken pox": ["Antiviral medication in severe cases", "Calamine lotion to relieve itching"],
    "Dengue": ["Rest and hydration", "Pain relief medication"],
    "Typhoid": ["Antibiotics", "Rest and hydration"],
    "Impetigo": ["Antibacterial creams or ointments", "Oral antibiotics in severe cases"]
};

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/diseaseDetails', (req, res) => {
    res.render('disease', { diseases });
})

app.post('/diseaseDetails', (req, res) => {
    const symptoms = req.body;
    if(!symptoms) {
        res.redirect('/diseaseDetails')
        return;
    }
    let diseaseObj = {};
    for (let dis of diseases) {
        if (symptoms[dis]) {
            diseaseObj[dis] = 1;
        }
        else diseaseObj[dis] = 0;
    }
    let options = {
        scriptPath: "",
        mode: "json",
        args: [JSON.stringify(diseaseObj)]
    }
    PythonShell.run("run.py", options, (err, res) => {
        if (err) console.log(err);
    }).then(() => {
        res.redirect('/result');
    })
})

app.get('/result', async (req, res) => {
    setTimeout(() => {
      const jsonData = fs.readFileSync('result.json', 'utf8');
      const data = JSON.parse(jsonData);
      const disease = data.disease;
      const treatments = treatment[disease];
      res.render('result', { disease, treatments });
    }, 4000);
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
