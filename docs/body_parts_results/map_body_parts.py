import json
import re

# Load batch data
with open('/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/docs/body_parts_batches/batch_001.json', 'r') as f:
    data = json.load(f)

def determine_body_parts(icd_code, disease_name):
    """
    Determine body parts affected based on ICD-10-CM code and disease name.
    Uses both code-based and keyword-based mapping.
    """
    name_lower = disease_name.lower()
    code = icd_code.upper()

    parts = []

    # ============================================================
    # KEYWORD-BASED MAPPING (most specific, highest priority)
    # ============================================================

    # Brain / CNS
    if any(w in name_lower for w in ['encephalitis', 'encephalopathy', 'encephalomyelitis',
                                      'brain abscess', 'brain and spinal', 'cerebral',
                                      'cerebrospinal', 'cerebrovascular',
                                      'creutzfeldt', 'kuru', 'gerstmann', 'fatal familial insomnia',
                                      'panencephalitis', 'leukoencephalopathy',
                                      'meningoencephalitis']):
        parts.append('brain')

    # Meninges
    if any(w in name_lower for w in ['meningitis', 'meningeal', 'meningoencephalitis']):
        parts.append('meninges')

    # Spinal cord
    if any(w in name_lower for w in ['myelitis', 'spinal cord', 'tabes dorsalis',
                                      'radiculomyelitis', 'poliomyelitis', 'cerebrospinal']):
        parts.append('spinal cord')

    # Nerves / nervous system
    if any(w in name_lower for w in ['neuritis', 'neuropathy', 'polyneuropathy', 'polyneuritis',
                                      'nervous system', 'neurosyphilis', 'neurologic',
                                      'neuralgia', 'ganglionitis', 'general paresis',
                                      'geniculate ganglion']):
        parts.append('peripheral nerves')

    # Heart
    if any(w in name_lower for w in ['heart', 'cardiac', 'carditis', 'myocarditis',
                                      'endocarditis', 'pericarditis', 'cardiomyopathy',
                                      'cardiovascular']):
        parts.append('heart')
    if 'pericarditis' in name_lower or 'pericardial' in name_lower:
        parts.append('pericardium')
    if 'endocarditis' in name_lower:
        if 'heart' not in parts:
            parts.append('heart')

    # Lungs
    if any(w in name_lower for w in ['pneumonia', 'pneumonitis', 'pulmonary', 'lung',
                                      'bronchopulmonary']):
        parts.append('lungs')

    # Pleura
    if 'pleurisy' in name_lower or 'pleural' in name_lower:
        parts.append('pleura')

    # Trachea / Bronchi
    if any(w in name_lower for w in ['trachea', 'bronchus', 'bronchi']):
        parts.append('trachea')
        if 'bronch' in name_lower:
            parts.append('bronchi')

    # Larynx
    if 'larynx' in name_lower or 'laryngeal' in name_lower:
        parts.append('larynx')

    # Pharynx / throat
    if any(w in name_lower for w in ['pharyngitis', 'pharynx', 'pharyngeal', 'nasopharyngeal',
                                      'pharyngotonsillitis', 'pharyngoconjunctivitis']):
        parts.append('pharynx')

    # Tonsils
    if 'tonsil' in name_lower:
        parts.append('tonsils')

    # Liver
    if any(w in name_lower for w in ['hepatitis', 'hepatic', 'liver', 'hepat']):
        parts.append('liver')

    # Intestines / GI tract
    if any(w in name_lower for w in ['enteritis', 'intestin', 'enterocolitis', 'colitis',
                                      'dysentery', 'enteropathogenic', 'enterotoxigenic',
                                      'enteroinvasive', 'enterohemorrhagic', 'gastroenteritis',
                                      'gastroenteropathy', 'enteric']):
        parts.append('intestines')

    # Colon specifically
    if any(w in name_lower for w in ['colitis', 'colon', 'megacolon']):
        if 'colon' not in parts:
            parts.append('colon')

    # Stomach
    if any(w in name_lower for w in ['gastric', 'stomach', 'gastroenter', 'gastrointestinal']):
        parts.append('stomach')

    # Esophagus
    if any(w in name_lower for w in ['esophagitis', 'esophagus', 'megaesophagus']):
        parts.append('esophagus')

    # Rectum / Anus
    has_anus = re.search(r'\banus\b', name_lower) and 'tetanus' not in name_lower
    has_anal = re.search(r'\banal\b', name_lower)
    if any(w in name_lower for w in ['rectum', 'rectal', 'anogenital', 'perianal']) or has_anus or has_anal:
        parts.append('rectum')
        if has_anus or has_anal or 'perianal' in name_lower:
            parts.append('anus')

    # Peritoneum
    if 'peritonitis' in name_lower or 'peritoneal' in name_lower or 'retroperitoneal' in name_lower:
        parts.append('peritoneum')

    # Kidneys
    has_renal = re.search(r'\brenal\b', name_lower) and 'adrenal' not in name_lower
    if any(w in name_lower for w in ['kidney', 'nephritis', 'nephropathy',
                                      'pyelonephritis', 'tubulo-interstitial',
                                      'urinary organ', 'urinary system']) or has_renal:
        parts.append('kidneys')

    # Ureter
    if 'ureter' in name_lower:
        if 'kidneys' not in parts:
            parts.append('kidneys')

    # Bladder
    if any(w in name_lower for w in ['bladder', 'cystitis', 'urinary organ', 'urinary system']):
        parts.append('bladder')

    # Urethra
    if 'urethritis' in name_lower or 'urethra' in name_lower:
        parts.append('bladder')

    # Prostate
    if 'prostat' in name_lower:
        parts.append('prostate')

    # Male genital
    if any(w in name_lower for w in ['penis', 'balanitis', 'orchitis', 'male genital',
                                      'testes', 'testicular']):
        if 'orchitis' in name_lower or 'testes' in name_lower or 'testicular' in name_lower:
            parts.append('testes')
        if 'penis' in name_lower or 'balanitis' in name_lower:
            parts.append('penis')
        if 'male genital' in name_lower:
            parts.append('testes')
            parts.append('penis')

    # Female genital
    if any(w in name_lower for w in ['vulvovaginitis', 'vagina', 'cervix', 'cervicitis',
                                      'female genital', 'female pelvic', 'uterus', 'uterine',
                                      'vulva']):
        if 'cervic' in name_lower:
            parts.append('cervix')
        if 'vagina' in name_lower or 'vulvovaginitis' in name_lower or 'vulva' in name_lower:
            parts.append('vagina')
        if 'female pelvic' in name_lower:
            parts.append('uterus')
            parts.append('ovaries')
            parts.append('fallopian tubes')
        if 'female genital' in name_lower:
            parts.append('uterus')
            parts.append('vagina')

    # Genitourinary (general)
    if any(w in name_lower for w in ['genitourinary', 'urogenital']):
        if not any(p in parts for p in ['kidneys', 'bladder', 'prostate', 'testes', 'penis',
                                         'cervix', 'vagina', 'uterus']):
            parts.extend(['kidneys', 'bladder'])

    # Eyes
    if any(w in name_lower for w in ['oculopathy', 'ocular', 'eye', 'conjunctivitis',
                                      'keratitis', 'iridocyclitis', 'chorioretinitis',
                                      'retrobulbar', 'scleritis', 'keratoconjunctivitis',
                                      'optic nerve', 'trachoma', 'endophthalmitis',
                                      'glaucoma', 'retinitis']):
        parts.append('eyes')

    # Ears
    if any(w in name_lower for w in ['otitis', 'aural']):
        parts.append('ears')
    if re.search(r'\bear\b', name_lower) and 'heart' not in name_lower:
        parts.append('ears')

    # Skin
    # Use word-boundary matching for 'mycosis' and 'mycoses' to avoid matching inside
    # compound words like 'coccidioidomycosis', 'mucormycosis', 'cryptococcosis', etc.
    has_mycosis = bool(re.search(r'\bmycosis\b', name_lower)) and not any(
        w in name_lower for w in ['coccidioidomycosis', 'mucormycosis', 'cryptococcosis',
                                   'histoplasmosis', 'blastomycosis', 'paracoccidioidomycosis',
                                   'aspergillosis', 'sporotrichosis', 'chromomycosis'])
    has_mycoses = bool(re.search(r'\bmycoses\b', name_lower))
    if any(w in name_lower for w in ['cutaneous', 'skin', 'dermatitis', 'dermatophyt',
                                      'tinea', 'pityriasis', 'piedra', 'exanthem',
                                      'wart', 'warts', 'cowpox', 'molluscum', 'poxvirus',
                                      'parapoxvirus', 'eczema', 'vesicular dermatitis',
                                      'erysipelas', 'cellulo', 'gangrene',
                                      'erythema infectiosum', 'scabies', 'pediculosis',
                                      'phthiriasis', 'pinta', 'yaws', 'leprosy',
                                      'chromomycosis',
                                      'lobomycosis', 'subcutaneous']) or has_mycosis or has_mycoses:
        parts.append('skin')

    # Nails
    if 'unguium' in name_lower or 'nail' in name_lower:
        parts.append('nails')

    # Hair
    if 'capitis' in name_lower or 'barbae' in name_lower or 'alopecia' in name_lower:
        parts.append('hair')
        if 'skin' not in parts:
            parts.append('skin')

    # Mouth / oral
    if any(w in name_lower for w in ['stomatitis', 'oral', 'mouth', 'cheilitis',
                                      'gingivostomatitis']):
        parts.append('mouth')

    # Gums
    if 'gingivo' in name_lower:
        parts.append('gums')

    # Lips
    if 'cheilitis' in name_lower or 'lip ' in name_lower:
        parts.append('lips')

    # Nose
    if any(w in name_lower for w in ['rhinitis', 'nose', 'saddle nose', 'nasal',
                                      'rhinocerebral', 'rhinosporidiosis']):
        parts.append('nose')
    if 'sinuses' in name_lower or 'sinus' in name_lower:
        parts.append('sinuses')

    # Teeth
    if any(w in name_lower for w in ['teeth', 'dental', "hutchinson's teeth"]):
        parts.append('teeth')

    # Bones
    if any(w in name_lower for w in ['osteomyelitis', 'osteochondropathy', 'bone',
                                      'osseous', 'osteopathy']):
        parts.append('bones')

    # Joints
    if any(w in name_lower for w in ['arthritis', 'arthropathy', 'joint', 'spondylopathy']):
        parts.append('joints')

    # Spine
    if any(w in name_lower for w in ['spine', 'spinal', 'spondylo', 'vertebr']):
        if 'spine' not in parts:
            parts.append('spine')

    # Muscles
    if any(w in name_lower for w in ['myositis', 'myalgia', 'muscle', 'musculoskeletal']):
        parts.append('muscles')

    # Lymph nodes
    if any(w in name_lower for w in ['lymph', 'lymphaden', 'lymphogranuloma',
                                      'lymphocutaneous']):
        parts.append('lymph nodes')

    # Spleen
    if 'spleen' in name_lower or 'splenic' in name_lower:
        parts.append('spleen')

    # Pancreas
    if 'pancreatitis' in name_lower or 'pancreas' in name_lower or 'pancreatic' in name_lower:
        parts.append('pancreas')

    # Thyroid
    if 'thyroid' in name_lower:
        parts.append('thyroid')

    # Adrenal glands
    if 'adrenal' in name_lower:
        parts.append('adrenal glands')

    # Endocrine (general)
    if 'endocrine' in name_lower:
        parts.append('thyroid')

    # Blood / bloodstream
    if any(w in name_lower for w in ['sepsis', 'septicemia', 'septicemic', 'bacteremia',
                                      'viremia', 'hemorrhagic fever']):
        parts.append('blood')

    # Blood vessels
    if any(w in name_lower for w in ['aneurysm', 'aortitis', 'arteritis', 'vascular',
                                      'vasculitis']):
        parts.append('blood vessels')
        if 'aort' in name_lower:
            parts.append('arteries')

    # Red blood cells
    if any(w in name_lower for w in ['malaria', 'babesiosis']):
        if 'blood' not in parts:
            parts.append('blood')
        parts.append('red blood cells')

    # Pelvis
    if 'pelvic' in name_lower and 'female pelvic' not in name_lower:
        parts.append('pelvis')

    # Groin
    if 'inguinal' in name_lower or 'groin' in name_lower or 'cruris' in name_lower:
        parts.append('groin')

    # Foot / hand / other extremities
    if 'pedis' in name_lower or 'plantar' in name_lower:
        parts.append('foot')
    if 'manuum' in name_lower:
        parts.append('hand')

    # Connective tissue
    if 'connective tissue' in name_lower:
        parts.append('connective tissue')

    # Abdomen
    if 'abdominal' in name_lower or 'abdomen' in name_lower:
        parts.append('abdomen')

    # Chest
    if 'intrathoracic' in name_lower or 'thoracic' in name_lower:
        if 'lymph nodes' not in parts:
            parts.append('lymph nodes')
        parts.append('chest')

    # Neck / cervicofacial
    if 'cervicofacial' in name_lower:
        parts.append('neck')

    # ============================================================
    # CODE-BASED FALLBACK for entries that didn't match keywords
    # ============================================================

    if not parts:
        # A00-A09: Intestinal infectious diseases
        if re.match(r'^A0[0-9]', code):
            parts = ['intestines', 'stomach']

        # A15-A19: Tuberculosis
        elif re.match(r'^A1[5-9]', code):
            parts = ['lungs']

        # A20: Plague
        elif code.startswith('A20'):
            parts = ['lymph nodes', 'blood']

        # A21: Tularemia
        elif code.startswith('A21'):
            parts = ['lymph nodes', 'skin']

        # A22: Anthrax
        elif code.startswith('A22'):
            parts = ['skin', 'lungs']

        # A23: Brucellosis
        elif code.startswith('A23'):
            parts = ['whole body']

        # A24: Glanders and melioidosis
        elif code.startswith('A24'):
            parts = ['lungs', 'skin']

        # A25: Rat-bite fevers
        elif code.startswith('A25'):
            parts = ['skin', 'joints']

        # A26: Erysipeloid
        elif code.startswith('A26'):
            parts = ['skin']

        # A27: Leptospirosis
        elif code.startswith('A27'):
            parts = ['liver', 'kidneys']

        # A28: Other zoonotic bacterial diseases
        elif code.startswith('A28'):
            parts = ['lymph nodes']

        # A30: Leprosy
        elif code.startswith('A30'):
            parts = ['skin', 'peripheral nerves']

        # A31: Mycobacterial infection
        elif code.startswith('A31'):
            parts = ['lungs']

        # A32: Listeriosis
        elif code.startswith('A32'):
            parts = ['whole body']

        # A33-A35: Tetanus
        elif code.startswith('A33') or code.startswith('A34') or code.startswith('A35'):
            parts = ['muscles', 'peripheral nerves']

        # A36: Diphtheria
        elif code.startswith('A36'):
            parts = ['pharynx', 'larynx']

        # A37: Whooping cough
        elif code.startswith('A37'):
            parts = ['lungs', 'trachea', 'bronchi']

        # A38: Scarlet fever
        elif code.startswith('A38'):
            parts = ['pharynx', 'skin']

        # A39: Meningococcal
        elif code.startswith('A39'):
            parts = ['meninges', 'blood']

        # A40-A41: Sepsis
        elif code.startswith('A40') or code.startswith('A41'):
            parts = ['blood']

        # A42: Actinomycosis
        elif code.startswith('A42'):
            parts = ['lungs', 'abdomen']

        # A43: Nocardiosis
        elif code.startswith('A43'):
            parts = ['lungs']

        # A44: Bartonellosis
        elif code.startswith('A44'):
            parts = ['blood', 'skin']

        # A46: Erysipelas
        elif code.startswith('A46'):
            parts = ['skin']

        # A48: Other bacterial diseases
        elif code.startswith('A48'):
            parts = ['whole body']

        # A49: Bacterial infection unspecified
        elif code.startswith('A49'):
            parts = ['whole body']

        # A50-A53: Syphilis
        elif re.match(r'^A5[0-3]', code):
            parts = ['whole body']

        # A54: Gonococcal
        elif code.startswith('A54'):
            parts = ['kidneys', 'bladder']

        # A55-A56: Chlamydial
        elif code.startswith('A55') or code.startswith('A56'):
            parts = ['lymph nodes']

        # A57: Chancroid
        elif code.startswith('A57'):
            parts = ['skin', 'groin']

        # A58: Granuloma inguinale
        elif code.startswith('A58'):
            parts = ['skin', 'groin']

        # A59: Trichomoniasis
        elif code.startswith('A59'):
            parts = ['vagina', 'bladder']

        # A60: Herpesviral infections
        elif code.startswith('A60'):
            parts = ['skin']

        # A63: Other predominantly sexually transmitted diseases
        elif code.startswith('A63'):
            parts = ['skin']

        # A64: Unspecified STD
        elif code.startswith('A64'):
            parts = ['whole body']

        # A65: Nonvenereal syphilis
        elif code.startswith('A65'):
            parts = ['skin']

        # A66: Yaws
        elif code.startswith('A66'):
            parts = ['skin', 'bones']

        # A67: Pinta
        elif code.startswith('A67'):
            parts = ['skin']

        # A68: Relapsing fevers
        elif code.startswith('A68'):
            parts = ['blood', 'whole body']

        # A69: Spirochetal infections
        elif code.startswith('A69'):
            parts = ['whole body']

        # A70: Chlamydia psittaci
        elif code.startswith('A70'):
            parts = ['lungs']

        # A71: Trachoma
        elif code.startswith('A71'):
            parts = ['eyes']

        # A74: Other chlamydial diseases
        elif code.startswith('A74'):
            parts = ['whole body']

        # A75: Typhus
        elif code.startswith('A75'):
            parts = ['blood', 'skin']

        # A77: Spotted fever
        elif code.startswith('A77'):
            parts = ['blood', 'skin']

        # A78: Q fever
        elif code.startswith('A78'):
            parts = ['lungs', 'liver']

        # A79: Rickettsioses
        elif code.startswith('A79'):
            parts = ['blood', 'skin']

        # A80: Poliomyelitis
        elif code.startswith('A80'):
            parts = ['spinal cord', 'muscles']

        # A81: Atypical virus infections of CNS
        elif code.startswith('A81'):
            parts = ['brain']

        # A82: Rabies
        elif code.startswith('A82'):
            parts = ['brain', 'peripheral nerves']

        # A83-A86: Viral encephalitis
        elif re.match(r'^A8[3-6]', code):
            parts = ['brain']

        # A87: Viral meningitis
        elif code.startswith('A87'):
            parts = ['meninges']

        # A88-A89: Other viral CNS infections
        elif code.startswith('A88') or code.startswith('A89'):
            parts = ['brain']

        # A90-A91: Dengue
        elif code.startswith('A90') or code.startswith('A91'):
            parts = ['blood', 'blood vessels']

        # A92: Mosquito-borne viral fevers
        elif code.startswith('A92'):
            parts = ['whole body']

        # A93: Other arthropod-borne viral fevers
        elif code.startswith('A93'):
            parts = ['whole body']

        # A94: Unspecified arthropod-borne viral fever
        elif code.startswith('A94'):
            parts = ['whole body']

        # A95: Yellow fever
        elif code.startswith('A95'):
            parts = ['liver', 'blood']

        # A96-A99: Viral hemorrhagic fevers
        elif re.match(r'^A9[6-9]', code):
            parts = ['blood', 'blood vessels']

        # B00: Herpes simplex
        elif code.startswith('B00'):
            parts = ['skin']

        # B01: Varicella
        elif code.startswith('B01'):
            parts = ['skin']

        # B02: Zoster
        elif code.startswith('B02'):
            parts = ['skin', 'peripheral nerves']

        # B03: Smallpox
        elif code.startswith('B03'):
            parts = ['skin']

        # B04: Monkeypox
        elif code.startswith('B04'):
            parts = ['skin', 'lymph nodes']

        # B05: Measles
        elif code.startswith('B05'):
            parts = ['skin', 'lungs']

        # B06: Rubella
        elif code.startswith('B06'):
            parts = ['skin', 'lymph nodes']

        # B07: Viral warts
        elif code.startswith('B07'):
            parts = ['skin']

        # B08: Other viral infections with skin lesions
        elif code.startswith('B08'):
            parts = ['skin']

        # B09: Unspecified viral with skin/mucous membrane
        elif code.startswith('B09'):
            parts = ['skin']

        # B10: Other human herpesvirus
        elif code.startswith('B10'):
            parts = ['whole body']

        # B15-B19: Viral hepatitis
        elif re.match(r'^B1[5-9]', code):
            parts = ['liver']

        # B20: HIV
        elif code.startswith('B20'):
            parts = ['whole body', 'white blood cells']

        # B25: Cytomegaloviral disease
        elif code.startswith('B25'):
            parts = ['whole body']

        # B26: Mumps
        elif code.startswith('B26'):
            parts = ['salivary glands']

        # B27: Infectious mononucleosis
        elif code.startswith('B27'):
            parts = ['lymph nodes', 'spleen', 'liver']

        # B30: Viral conjunctivitis
        elif code.startswith('B30'):
            parts = ['eyes']

        # B33: Other viral diseases
        elif code.startswith('B33'):
            parts = ['whole body']

        # B34: Viral infection, unspecified
        elif code.startswith('B34'):
            parts = ['whole body']

        # B35: Dermatophytosis
        elif code.startswith('B35'):
            parts = ['skin']

        # B36: Other superficial mycoses
        elif code.startswith('B36'):
            parts = ['skin']

        # B37: Candidiasis
        elif code.startswith('B37'):
            parts = ['skin', 'mouth']

        # B38: Coccidioidomycosis
        elif code.startswith('B38'):
            parts = ['lungs']

        # B39: Histoplasmosis
        elif code.startswith('B39'):
            parts = ['lungs']

        # B40: Blastomycosis
        elif code.startswith('B40'):
            parts = ['lungs']

        # B41: Paracoccidioidomycosis
        elif code.startswith('B41'):
            parts = ['lungs']

        # B42: Sporotrichosis
        elif code.startswith('B42'):
            parts = ['skin', 'lymph nodes']

        # B43: Chromomycosis
        elif code.startswith('B43'):
            parts = ['skin']

        # B44: Aspergillosis
        elif code.startswith('B44'):
            parts = ['lungs']

        # B45: Cryptococcosis
        elif code.startswith('B45'):
            parts = ['lungs', 'brain']

        # B46: Zygomycosis/Mucormycosis
        elif code.startswith('B46'):
            parts = ['lungs', 'sinuses']

        # B47: Mycetoma
        elif code.startswith('B47'):
            parts = ['skin', 'foot']

        # B48: Other mycoses
        elif code.startswith('B48'):
            parts = ['skin', 'lungs']

        # B49: Unspecified mycosis
        elif code.startswith('B49'):
            parts = ['whole body']

        # B50-B54: Malaria
        elif re.match(r'^B5[0-4]', code):
            parts = ['blood', 'red blood cells', 'spleen', 'liver']

        # B55: Leishmaniasis
        elif code.startswith('B55'):
            parts = ['skin', 'spleen', 'liver']

        # B56: African trypanosomiasis
        elif code.startswith('B56'):
            parts = ['brain', 'blood', 'lymph nodes']

        # B57: Chagas disease
        elif code.startswith('B57'):
            parts = ['heart']

        # B58: Toxoplasmosis
        elif code.startswith('B58'):
            parts = ['whole body']

        # B59: Pneumocystosis
        elif code.startswith('B59'):
            parts = ['lungs']

        # B60: Other protozoal diseases
        elif code.startswith('B60'):
            parts = ['whole body']

        # B64: Unspecified protozoal disease
        elif code.startswith('B64'):
            parts = ['whole body']

        # B65: Schistosomiasis
        elif code.startswith('B65'):
            parts = ['liver', 'intestines', 'bladder']

        # B66: Other fluke infections
        elif code.startswith('B66'):
            parts = ['liver']

        # B67: Echinococcosis
        elif code.startswith('B67'):
            parts = ['liver']

        # B68-B71: Cestode infections
        elif re.match(r'^B6[89]|^B7[01]', code):
            parts = ['intestines']

        # B72: Dracunculiasis
        elif code.startswith('B72'):
            parts = ['skin', 'connective tissue']

        # B73: Onchocerciasis
        elif code.startswith('B73'):
            parts = ['skin', 'eyes']

        # B74: Filariasis
        elif code.startswith('B74'):
            parts = ['lymph vessels', 'lymph nodes']

        # B75: Trichinellosis
        elif code.startswith('B75'):
            parts = ['muscles', 'intestines']

        # B76: Hookworm diseases
        elif code.startswith('B76'):
            parts = ['intestines']

        # B77: Ascariasis
        elif code.startswith('B77'):
            parts = ['intestines']

        # B78: Strongyloidiasis
        elif code.startswith('B78'):
            parts = ['intestines', 'skin']

        # B79: Trichuriasis
        elif code.startswith('B79'):
            parts = ['intestines']

        # B80: Enterobiasis
        elif code.startswith('B80'):
            parts = ['intestines', 'anus']

        # B81: Other intestinal helminthiases
        elif code.startswith('B81'):
            parts = ['intestines']

        # B82: Intestinal parasitism
        elif code.startswith('B82'):
            parts = ['intestines']

        # B83: Other helminthiases
        elif code.startswith('B83'):
            parts = ['whole body']

        # B85: Pediculosis and phthiriasis
        elif code.startswith('B85'):
            parts = ['skin', 'hair']

        # B86: Scabies
        elif code.startswith('B86'):
            parts = ['skin']

        # B87: Myiasis
        elif code.startswith('B87'):
            parts = ['skin']

        else:
            parts = ['whole body']

    # ============================================================
    # POST-PROCESSING: Handle special cases and refinements
    # ============================================================

    # Botulism
    if 'botulism' in name_lower or 'botulinum' in name_lower:
        if 'peripheral nerves' not in parts and 'muscles' not in parts:
            parts.extend(['peripheral nerves', 'muscles'])

    # Toxic shock syndrome
    if 'toxic shock' in name_lower:
        parts = ['whole body', 'blood']

    # Gas gangrene
    if 'gas gangrene' in name_lower:
        parts = ['muscles', 'skin', 'connective tissue']

    # Legionnaires' disease
    if 'legionnaires' in name_lower or 'legionella' in name_lower:
        if 'lungs' not in parts:
            parts.append('lungs')

    # Pontiac fever
    if 'pontiac fever' in name_lower:
        parts = ['whole body']

    # Brazilian purpuric fever
    if 'purpuric fever' in name_lower:
        parts = ['blood', 'eyes']

    # Waterhouse-Friderichsen syndrome
    if 'waterhouse' in name_lower:
        parts = ['adrenal glands', 'blood']

    # Cat-scratch disease
    if 'cat-scratch' in name_lower:
        parts = ['lymph nodes', 'skin']

    # Epidemic vertigo
    if 'epidemic vertigo' in name_lower:
        parts = ['ears', 'brain']

    # Epidemic myalgia
    if 'epidemic myalgia' in name_lower:
        parts = ['muscles', 'chest']

    # Ross River disease
    if 'ross river' in name_lower:
        parts = ['joints', 'muscles', 'skin']

    # Hantavirus
    if 'hantavirus' in name_lower:
        parts = ['lungs', 'heart']

    # Hemorrhagic fever with renal syndrome
    if 'hemorrhagic fever with renal' in name_lower:
        parts = ['kidneys', 'blood']

    # Chikungunya
    if 'chikungunya' in name_lower:
        parts = ['joints', 'muscles', 'skin']

    # O'nyong-nyong
    if "o'nyong" in name_lower:
        parts = ['joints', 'lymph nodes']

    # West Nile
    if 'west nile' in name_lower and not any(p in parts for p in ['brain', 'peripheral nerves']):
        if 'encephalitis' not in name_lower and 'neurologic' not in name_lower:
            parts = ['whole body']

    # Zika
    if 'zika' in name_lower:
        parts = ['whole body', 'brain']

    # Rift Valley fever
    if 'rift valley' in name_lower:
        parts = ['liver', 'eyes', 'blood']

    # Leptospirosis icterohemorrhagica
    if 'icterohemorrhagica' in name_lower:
        parts = ['liver', 'kidneys', 'blood']

    # Pasteurellosis
    if 'pasteurellosis' in name_lower:
        parts = ['skin', 'connective tissue']

    # Extraintestinal yersiniosis
    if 'extraintestinal yersiniosis' in name_lower:
        parts = ['lymph nodes', 'joints']

    # Vincent's infections
    if "vincent" in name_lower:
        parts = ['gums', 'mouth']

    # Lyme disease general
    if 'lyme disease, unspecified' in name_lower:
        parts = ['skin', 'joints', 'peripheral nerves']

    # Scarlet fever uncomplicated
    if 'scarlet fever' in name_lower and 'uncomplicated' in name_lower:
        parts = ['pharynx', 'skin']

    # Mumps without complication
    if 'mumps' in name_lower and 'without complication' in name_lower:
        parts = ['salivary glands']

    # Condyloma latum
    if 'condyloma' in name_lower:
        parts = ['skin', 'anus']

    # Hutchinson's triad
    if "hutchinson's triad" in name_lower:
        parts = ['teeth', 'eyes', 'ears']

    # Clutton's joints
    if "clutton" in name_lower:
        parts = ['joints']

    # Disseminated diseases
    if 'disseminated' in name_lower:
        if 'whole body' not in parts:
            parts.append('whole body')

    # Miliary tuberculosis
    if 'miliary' in name_lower:
        parts = ['whole body', 'lungs']

    # Visceral larva migrans
    if 'visceral larva migrans' in name_lower:
        parts = ['liver', 'lungs', 'eyes']

    # Gnathostomiasis
    if 'gnathostomiasis' in name_lower:
        parts = ['skin', 'brain']

    # Angiostrongyliasis (brain)
    if 'angiostrongyliasis' in name_lower and 'cantonensis' in name_lower:
        parts = ['brain', 'meninges']

    # Syngamiasis
    if 'syngamiasis' in name_lower:
        parts = ['trachea', 'bronchi']

    # Internal hirudiniasis
    if 'hirudiniasis' in name_lower:
        parts = ['pharynx', 'nose', 'intestines']

    # Rhinocerebral mucormycosis
    if 'rhinocerebral' in name_lower:
        parts = ['sinuses', 'nose', 'brain']

    # Gastrointestinal mucormycosis
    if 'gastrointestinal mucormycosis' in name_lower:
        parts = ['stomach', 'intestines']

    # Nasopharyngeal myiasis
    if 'nasopharyngeal myiasis' in name_lower:
        parts = ['nose', 'pharynx']

    # Wound myiasis
    if 'wound myiasis' in name_lower:
        parts = ['skin', 'muscles']

    # Ocular myiasis
    if 'ocular myiasis' in name_lower:
        parts = ['eyes']

    # Aural myiasis
    if 'aural myiasis' in name_lower:
        parts = ['ears']

    # Genitourinary myiasis
    if 'genitourinary myiasis' in name_lower:
        parts = ['bladder', 'kidneys']

    # Intestinal myiasis
    if 'intestinal myiasis' in name_lower:
        parts = ['intestines']

    # Diphyllobothriasis
    if 'diphyllobothriasis' in name_lower:
        parts = ['intestines']

    # Sparganosis
    if 'sparganosis' in name_lower:
        parts = ['skin', 'connective tissue', 'eyes']

    # Hymenolepiasis
    if 'hymenolepiasis' in name_lower:
        parts = ['intestines']

    # Dipylidiasis
    if 'dipylidiasis' in name_lower:
        parts = ['intestines']

    # Loiasis
    if 'loiasis' in name_lower:
        parts = ['eyes', 'skin', 'connective tissue']

    # Mansonelliasis
    if 'mansonelliasis' in name_lower:
        parts = ['blood', 'skin']

    # Cercarial dermatitis
    if 'cercarial' in name_lower:
        parts = ['skin']

    # Liver flukes
    if any(w in name_lower for w in ['opisthorchiasis', 'clonorchiasis', 'dicroceliasis',
                                      'fascioliasis']):
        parts = ['liver']

    # Lung fluke
    if 'paragonimiasis' in name_lower:
        parts = ['lungs']

    # Intestinal fluke
    if 'fasciolopsiasis' in name_lower:
        parts = ['intestines']

    # Visceral leishmaniasis
    if 'visceral leishmaniasis' in name_lower:
        parts = ['spleen', 'liver', 'bone marrow']

    # Mucocutaneous leishmaniasis
    if 'mucocutaneous leishmaniasis' in name_lower:
        parts = ['skin', 'nose', 'mouth']

    # Trypanosomiasis specifics
    if 'trypanosomiasis' in name_lower:
        if 'gambiense' in name_lower:
            parts = ['brain', 'lymph nodes', 'blood']
        elif 'rhodesiense' in name_lower:
            parts = ['blood', 'brain', 'heart']

    # Schistosomiasis specifics
    if 'schistosoma haematobium' in name_lower or 'urinary schistosomiasis' in name_lower:
        parts = ['bladder', 'kidneys']
    if 'schistosoma mansoni' in name_lower or 'intestinal schistosomiasis' in name_lower:
        parts = ['intestines', 'liver']
    if 'schistosoma japonicum' in name_lower:
        parts = ['liver', 'intestines']

    # Cysticercosis specifics
    if 'cysticercosis of central nervous system' in name_lower:
        parts = ['brain']
    if 'cysticercosis of eye' in name_lower:
        parts = ['eyes']
    if 'myositis in cysticercosis' in name_lower:
        parts = ['muscles']

    # Echinococcus bone
    if 'echinococcus' in name_lower and 'bone' in name_lower:
        parts = ['bones']

    # Pheomycotic brain abscess
    if 'pheomycotic brain' in name_lower:
        parts = ['brain']

    # Cerebral sporotrichosis
    if 'cerebral sporotrichosis' in name_lower:
        parts = ['brain']

    # Sporotrichosis arthritis
    if 'sporotrichosis arthritis' in name_lower:
        parts = ['joints']

    # Prostatic coccidioidomycosis
    if 'prostatic' in name_lower:
        parts = ['prostate']

    # Cerebral cryptococcosis
    if 'cerebral cryptococcosis' in name_lower:
        parts = ['brain']

    # Cutaneous cryptococcosis
    if 'cutaneous cryptococcosis' in name_lower:
        parts = ['skin']

    # Osseous cryptococcosis
    if 'osseous cryptococcosis' in name_lower:
        parts = ['bones']

    # Tonsillar aspergillosis
    if 'tonsillar aspergillosis' in name_lower:
        parts = ['tonsils']

    # Allergic bronchopulmonary aspergillosis
    if 'allergic bronchopulmonary' in name_lower:
        parts = ['lungs', 'bronchi']

    # Cutaneous blastomycosis
    if 'cutaneous blastomycosis' in name_lower:
        parts = ['skin']

    # Blastomycotic meningoencephalitis
    if 'blastomycotic meningoencephalitis' in name_lower:
        parts = ['brain', 'meninges']

    # Lobomycosis
    if 'lobomycosis' in name_lower:
        parts = ['skin']

    # Rhinosporidiosis
    if 'rhinosporidiosis' in name_lower:
        parts = ['nose']

    # Allescheriasis
    if 'allescheriasis' in name_lower:
        parts = ['lungs', 'skin']

    # Geotrichosis
    if 'geotrichosis' in name_lower:
        parts = ['lungs', 'mouth']

    # Penicillosis
    if 'penicillosis' in name_lower:
        parts = ['lungs', 'skin']

    # Mycetoma
    if 'eumycetoma' in name_lower or 'actinomycetoma' in name_lower or ('mycetoma' in name_lower and 'eumycetoma' not in name_lower and 'actinomycetoma' not in name_lower):
        parts = ['skin', 'foot']

    # Acanthamoeba specifics
    if 'acanthamoeba' in name_lower or 'acanthamebiasis' in name_lower:
        if 'conjunctivitis' in name_lower or 'keratoconjunctivitis' in name_lower:
            parts = ['eyes']
        elif 'meningoencephalitis' in name_lower:
            parts = ['brain', 'meninges']
        elif 'unspecified' in name_lower:
            parts = ['brain', 'eyes']

    # Naegleriasis
    if 'naegleriasis' in name_lower:
        parts = ['brain']

    # Babesiosis
    if 'babesiosis' in name_lower:
        parts = ['blood', 'red blood cells']

    # Retrovirus infections
    if 'retrovirus' in name_lower:
        parts = ['white blood cells', 'whole body']

    # Malaria specifics
    if 'falciparum' in name_lower and 'cerebral' in name_lower:
        parts = ['brain', 'blood', 'red blood cells']
    if 'vivax' in name_lower and 'spleen' in name_lower:
        parts = ['spleen', 'blood', 'red blood cells']
    if 'malariae' in name_lower and 'nephropathy' in name_lower:
        parts = ['kidneys', 'blood', 'red blood cells']

    # Mononucleosis specifics
    if 'mononucleosis' in name_lower:
        if 'polyneuropathy' in name_lower:
            parts = ['peripheral nerves', 'lymph nodes', 'spleen']
        elif 'meningitis' in name_lower:
            parts = ['meninges', 'lymph nodes', 'spleen']
        elif 'without complication' in name_lower or 'without complications' in name_lower:
            parts = ['lymph nodes', 'spleen', 'pharynx']
        elif 'other complication' in name_lower:
            parts = ['lymph nodes', 'spleen', 'liver']

    # Coronavirus
    if 'coronavirus' in name_lower:
        parts = ['lungs', 'whole body']

    # Enteroviral vesicular stomatitis
    if 'enteroviral vesicular stomatitis' in name_lower:
        parts = ['mouth', 'skin']

    # Enteroviral vesicular pharyngitis
    if 'enteroviral vesicular pharyngitis' in name_lower:
        parts = ['pharynx']

    # Bovine stomatitis
    if 'bovine stomatitis' in name_lower:
        parts = ['mouth', 'skin']

    # Sealpox
    if 'sealpox' in name_lower:
        parts = ['skin']

    # Tanapox / Yaba pox
    if 'tanapox' in name_lower or 'yaba pox' in name_lower or 'yatapox' in name_lower:
        parts = ['skin']

    # Candidal stomatitis
    if 'candidal stomatitis' in name_lower:
        parts = ['mouth']

    # Candidal cheilitis
    if 'candidal cheilitis' in name_lower:
        parts = ['lips']

    # Candidal otitis externa
    if 'candidal otitis' in name_lower:
        parts = ['ears']

    # Glanders
    if name_lower == 'glanders':
        parts = ['lungs', 'skin']

    # Spirillosis / Streptobacillosis
    if 'spirillosis' in name_lower or 'streptobacillosis' in name_lower or 'rat-bite' in name_lower:
        parts = ['skin', 'joints']

    # Lyme disease specifics
    if 'lyme disease, unspecified' in name_lower:
        parts = ['skin', 'joints', 'peripheral nerves']
    if 'meningitis due to lyme' in name_lower:
        parts = ['meninges']
    if 'neurologic disorders in lyme' in name_lower:
        parts = ['brain', 'peripheral nerves']
    if 'arthritis due to lyme' in name_lower:
        parts = ['joints']
    if 'other conditions associated with lyme' in name_lower:
        parts = ['skin', 'heart', 'joints']

    # Typhoid specifics
    if 'typhoid' in name_lower:
        if 'meningitis' in name_lower:
            parts = ['meninges', 'intestines']
        elif 'heart involvement' in name_lower:
            parts = ['heart', 'intestines']
        elif 'pneumonia' in name_lower:
            parts = ['lungs', 'intestines']
        elif 'arthritis' in name_lower:
            parts = ['joints', 'intestines']
        elif 'osteomyelitis' in name_lower:
            parts = ['bones', 'intestines']
        elif 'other complications' in name_lower:
            parts = ['intestines', 'whole body']
        elif 'unspecified' in name_lower:
            parts = ['intestines']

    # Paratyphoid
    if 'paratyphoid' in name_lower:
        parts = ['intestines']

    # Salmonella specifics
    if 'salmonella' in name_lower:
        if 'enteritis' in name_lower:
            parts = ['intestines']
        elif 'meningitis' in name_lower:
            parts = ['meninges']
        elif 'pneumonia' in name_lower:
            parts = ['lungs']
        elif 'arthritis' in name_lower:
            parts = ['joints']
        elif 'osteomyelitis' in name_lower:
            parts = ['bones']
        elif 'pyelonephritis' in name_lower:
            parts = ['kidneys']
        elif 'sepsis' in name_lower:
            parts = ['blood']
        elif 'localized' in name_lower:
            parts = ['whole body']
        elif 'unspecified' in name_lower or 'other specified' in name_lower:
            parts = ['intestines']

    # Amebic specifics
    if 'amebic' in name_lower or 'amebiasis' in name_lower:
        if 'liver abscess' in name_lower:
            parts = ['liver']
        elif 'lung abscess' in name_lower:
            parts = ['lungs']
        elif 'brain abscess' in name_lower:
            parts = ['brain']
        elif 'cystitis' in name_lower:
            parts = ['bladder']
        elif 'cutaneous' in name_lower:
            parts = ['skin']
        elif 'genitourinary' in name_lower:
            parts = ['kidneys', 'bladder']
        elif 'dysentery' in name_lower or 'colitis' in name_lower or 'ameboma' in name_lower:
            parts = ['intestines', 'colon']
        elif 'intestinal' in name_lower:
            parts = ['intestines']

    # Chancroid
    if 'chancroid' in name_lower:
        parts = ['skin', 'groin']

    # Chlamydial pharynx
    if 'chlamydial infection of pharynx' in name_lower:
        parts = ['pharynx']

    # Chlamydial anus/rectum
    if 'chlamydial infection of anus' in name_lower:
        parts = ['anus', 'rectum']

    # Early cutaneous congenital syphilis
    if 'early cutaneous congenital' in name_lower or 'mucocutaneous congenital' in name_lower:
        parts = ['skin']

    # Early visceral congenital syphilis
    if 'early visceral congenital syphilis' in name_lower:
        parts = ['liver', 'spleen']

    # Syphilitic alopecia
    if 'syphilitic alopecia' in name_lower:
        parts = ['hair', 'skin']

    # Whooping cough
    if 'whooping cough' in name_lower:
        if 'with pneumonia' in name_lower:
            parts = ['lungs', 'trachea', 'bronchi']
        else:
            parts = ['trachea', 'bronchi']

    # Herpesviral gingivostomatitis
    if 'gingivostomatitis' in name_lower:
        parts = ['mouth', 'gums', 'pharynx', 'tonsils']

    # Disseminated herpesviral disease
    if 'disseminated herpesviral' in name_lower:
        parts = ['whole body', 'skin']

    # Herpes simplex myelitis
    if 'herpes simplex myelitis' in name_lower:
        parts = ['spinal cord']

    # Varicella without complication
    if 'varicella without complication' in name_lower:
        parts = ['skin']

    # Zoster without complications
    if 'zoster without complications' in name_lower:
        parts = ['skin', 'peripheral nerves']

    # Measles without complication
    if 'measles without complication' in name_lower:
        parts = ['skin', 'lungs']

    # Measles with intestinal
    if 'measles with intestinal' in name_lower:
        parts = ['intestines']

    # Rubella without complication
    if 'rubella without complication' in name_lower:
        parts = ['skin', 'lymph nodes']

    # Rubella arthritis
    if 'rubella arthritis' in name_lower:
        parts = ['joints']

    # Plantar wart
    if 'plantar wart' in name_lower:
        parts = ['foot', 'skin']

    # Tinea corporis
    if 'tinea corporis' in name_lower or 'tinea imbricata' in name_lower:
        parts = ['skin']

    # Tinea cruris
    if 'tinea cruris' in name_lower:
        parts = ['skin', 'groin']

    # Vaccinia / cowpox
    if 'vaccinia' in name_lower or 'cowpox' in name_lower:
        parts = ['skin']

    # Orf virus
    if 'orf virus' in name_lower:
        parts = ['skin', 'hand']

    # Pseudocowpox
    if 'pseudocowpox' in name_lower or "milker's node" in name_lower:
        parts = ['skin', 'hand']

    # Exanthema subitum
    if 'exanthema subitum' in name_lower:
        parts = ['skin']

    # Erythema infectiosum
    if 'erythema infectiosum' in name_lower:
        parts = ['skin']

    # Smallpox
    if 'smallpox' in name_lower:
        parts = ['skin', 'whole body']

    # Monkeypox
    if 'monkeypox' in name_lower:
        parts = ['skin', 'lymph nodes']

    # Chagas' specifics
    if "chagas" in name_lower:
        if 'heart involvement' in name_lower:
            parts = ['heart']
        elif 'without heart' in name_lower:
            parts = ['whole body']
        elif 'megaesophagus' in name_lower:
            parts = ['esophagus']
        elif 'megacolon' in name_lower:
            parts = ['colon']
        elif 'digestive' in name_lower:
            parts = ['esophagus', 'colon', 'intestines']
        elif 'meningoencephalitis' in name_lower:
            parts = ['brain', 'meninges']
        elif 'meningitis' in name_lower:
            parts = ['meninges']
        elif 'nervous system' in name_lower:
            parts = ['brain', 'peripheral nerves']
        elif 'other organ' in name_lower:
            parts = ['whole body']

    # Toxoplasma specifics
    if 'toxoplasma' in name_lower:
        if 'chorioretinitis' in name_lower or 'oculopathy' in name_lower:
            parts = ['eyes']
        elif 'hepatitis' in name_lower:
            parts = ['liver']
        elif 'meningoencephalitis' in name_lower:
            parts = ['brain', 'meninges']
        elif 'myocarditis' in name_lower:
            parts = ['heart']
        elif 'myositis' in name_lower:
            parts = ['muscles']
        elif 'nephropathy' in name_lower:
            parts = ['kidneys']
        elif 'other organ' in name_lower:
            parts = ['whole body']
        elif 'unspecified' in name_lower:
            parts = ['whole body']

    # Hookworms
    if 'ancylostomiasis' in name_lower or 'necatoriasis' in name_lower or 'hookworm' in name_lower:
        parts = ['intestines']

    # Ascariasis specifics
    if 'ascariasis' in name_lower:
        if 'pneumonia' in name_lower:
            parts = ['lungs']
        elif 'intestinal' in name_lower:
            parts = ['intestines']
        elif 'other complications' in name_lower:
            parts = ['intestines', 'whole body']
        else:
            parts = ['intestines']

    # Strongyloidiasis specifics
    if 'strongyloidiasis' in name_lower:
        if 'intestinal' in name_lower:
            parts = ['intestines']
        elif 'cutaneous' in name_lower:
            parts = ['skin']
        elif 'disseminated' in name_lower:
            parts = ['whole body', 'intestines', 'lungs']
        else:
            parts = ['intestines']

    # Onchocerciasis specifics
    if 'onchocerciasis' in name_lower:
        if 'eye' in name_lower or 'endophthalmitis' in name_lower or 'glaucoma' in name_lower:
            parts = ['eyes']
        elif 'without eye' in name_lower:
            parts = ['skin']

    # Pediculosis specifics
    if 'pediculosis' in name_lower:
        if 'capitis' in name_lower:
            parts = ['skin', 'hair']
        elif 'corporis' in name_lower:
            parts = ['skin']
        else:
            parts = ['skin']

    # Phthiriasis
    if 'phthiriasis' in name_lower:
        parts = ['skin', 'groin']

    # Handle empty
    if not parts:
        parts = ['whole body']

    # Deduplicate while preserving order
    seen = set()
    unique_parts = []
    for p in parts:
        if p not in seen:
            seen.add(p)
            unique_parts.append(p)

    return ', '.join(unique_parts)

# Process all entries
results = []
for entry in data:
    body_parts = determine_body_parts(entry['icd_code'], entry['disease_name'])
    results.append({
        'row_num': entry['row_num'],
        'body_parts': body_parts
    })

# Write results
output_path = '/Users/chriscecora/Downloads/bodyPSDLayersbodyparts/docs/body_parts_results/results_001.json'
with open(output_path, 'w') as f:
    json.dump(results, f, indent=2)

print(f"Processed {len(results)} entries")
print(f"Output written to {output_path}")

# Verify
with open(output_path, 'r') as f:
    verify = json.load(f)
print(f"Verified: {len(verify)} entries in output")

# Print some samples
for i in [0, 5, 100, 500, 999]:
    print(f"  Entry {i}: row_num={verify[i]['row_num']}, body_parts={verify[i]['body_parts']}")
