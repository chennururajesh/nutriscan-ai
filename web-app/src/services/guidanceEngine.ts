/**
 * NutriScan AI - Post-Screening Guidance Engine
 * Provides specialized food precautions, health toxicity evaluations, 
 * and interactive food safety assistant answers based on Dew AI screening results.
 */

export interface PrecautionProfile {
  commodity: string;
  washingProtocol: string[];
  trimmingInstructions: string;
  storageRules: string[];
  culinaryAdvice: string;
  criticalWarnings: string[];
}

export interface DemographicRisk {
  group: 'Children & Infants' | 'Pregnant & Nursing Mothers' | 'Elderly Individuals' | 'Healthy Adults';
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  description: string;
}

export interface HealthImpactProfile {
  overallRiskLevel: 'Safe / Negligible' | 'Mild Risk' | 'Moderate Risk' | 'High / Severe Hazard';
  riskScorePercent: number;
  mycotoxinHazards: string[];
  chemicalHazards: string[];
  demographics: DemographicRisk[];
  symptomsToMonitor: string[];
  recommendedActions: string[];
}

export interface FoodSafetyRequest {
  id: string;
  timestamp: string;
  requestType: 'LAB_VERIFICATION' | 'VENDOR_COMPLAINT' | 'TEST_KIT_REQUEST';
  consumerName: string;
  consumerContact: string;
  vendorName: string;
  purchaseLocation: string;
  batchNumber?: string;
  scannedCommodity: string;
  damagePercentage: number;
  adulterantsScreened: string[];
  adulterationStatus: string;
  additionalNotes?: string;
  status: 'SUBMITTED' | 'ASSIGNED_TO_DISTRICT_LAB' | 'VERIFICATION_PENDING';
  trackingNumber: string;
}

/**
 * Returns specific decontamination and handling precautions based on commodity & damage.
 */
export function getCommodityPrecautions(
  commodity: string,
  damagePercentage: number,
  adulterants: string[] = []
): PrecautionProfile {
  const commLower = commodity.toLowerCase();
  const isApple = commLower.includes('apple');
  const isBanana = commLower.includes('banana');
  const isTomato = commLower.includes('tomato');
  const isTurmeric = commLower.includes('turmeric');
  const isChilli = commLower.includes('chilli');
  const isMilk = commLower.includes('milk');
  const isHoney = commLower.includes('honey');
  const isPepper = commLower.includes('pepper');

  let washing: string[] = [
    'Rinse thoroughly under vigorous cold running tap water for a minimum of 60 seconds.',
    'Soak in a 1% Sodium Bicarbonate (baking soda) or 2% saline solution for 12–15 minutes to strip lipophilic pesticide residues.',
    'Dry with a clean, single-use paper towel before slicing or storing to prevent surface moisture mold growth.'
  ];

  let trimming = 'Surface is clean. No surgical trimming of pulp is required.';
  if (damagePercentage > 0 && damagePercentage <= 25) {
    trimming = `Excise at least 2.5 cm (1 inch) of healthy flesh surrounding each necrotic/bruised blemish. Do not allow the knife blade to touch rotten tissue and then pass through sound tissue.`;
  } else if (damagePercentage > 25 && damagePercentage <= 50) {
    trimming = `Deep excision required: Discard at least 3.5 cm around necrotic lesions. If core or internal vascular tissue exhibits dark browning, discard entire sample due to systemic mycelial spread.`;
  } else if (damagePercentage > 50) {
    trimming = `TRIMMING NOT RECOMMENDED: Microscopic fungal hyphae have permeated sound-looking tissues. Entire commodity should be discarded into organic compost.`;
  }

  let storage: string[] = [
    'Store in a well-ventilated, cool crisper compartment at 4°C to 7°C.',
    'Maintain separate containment from ethylene-releasing fruits (apples, ripe bananas) to prevent accelerated ripening of adjacent produce.',
    'Inspect stored produce daily for early signs of softening or fungal spore development.'
  ];

  let culinary = 'Suitable for standard consumption after recommended surface decontamination.';
  let warnings: string[] = [];

  if (isApple) {
    washing = [
      'Warm Water Soak: Soak in lukewarm water (approx. 40°C) with 1 tablespoon of baking soda and lemon juice for 12 minutes to dissolve hydrophobic paraffin wax coatings.',
      'Mechanical Scrubbing: Use a soft natural produce brush along the stem cavity and calyx where wax and pesticide dust collect most densely.',
      'Peeling Option: For children or sensitive individuals, peeling the outer skin completely eliminates 95%+ of surface wax and superficial pesticide residues.'
    ];
    if (damagePercentage > 15) {
      warnings.push('Patulin Mycotoxin Hazard: Rotten apples harbor Penicillium expansum, synthesizing Patulin. Patulin is heat-stable and survives domestic pasteurization; do not use damaged apples for homemade purees or juices.');
    }
    if (adulterants.some(a => a.toLowerCase().includes('wax'))) {
      warnings.push('Suspected Paraffin Wax: Non-food-grade industrial paraffin wax can contain mineral oil contaminants that disrupt lipid digestion.');
    }
    culinary = damagePercentage <= 20 
      ? 'Safe to eat fresh or bake after trimming damaged quadrant. Do NOT use bruised portions in cider or unpasteurized juice.'
      : 'Unfit for raw snacking or juicing. High risk of microbial digestive irritation.';
  } else if (isBanana) {
    washing = [
      'Wash the outer peel under running water prior to peeling to avoid transferring surface contaminants or pesticide residues onto edible pulp via fingertips.'
    ];
    if (adulterants.some(a => a.toLowerCase().includes('carbide'))) {
      warnings.push('Calcium Carbide Alert: Artificially forced ripening via industrial carbide leaves toxic arsenic and phosphorus hydride traces on peel. Never bite peel to open.');
    }
    culinary = 'Consume immediately if peel shows black mottling. If pulp is watery or exhibits chemical odor, discard immediately.';
  } else if (isTomato) {
    washing = [
      'Submerge in warm dilute vinegar solution (1 part white vinegar to 4 parts water) for 10 minutes to eradicate Salmonella and surface mold spores.',
      'Rinse with potable water before slicing.'
    ];
    if (damagePercentage > 20) {
      warnings.push('Soft Rot Warning: Erwinia bacterial soft rot liquefies interior tomato pulp rapidly and creates enteric endotoxins.');
    }
  } else if (isTurmeric || isChilli) {
    washing = [
      'Dry Spice Handling: Do not wash powders. Store in an airtight amber glass jar away from humidity and direct sunlight.'
    ];
    warnings.push('Synthetic Azo Dye Hazard: Adulterated turmeric often contains carcinogenic Metanil Yellow or Lead Chromate; chilli may contain toxic Sudan I-IV dyes.');
    culinary = 'Perform a quick warm water dispersion test: Pure turmeric settles gently; dyed adulterated spices dissolve immediately with an artificial fluorescent sheen.';
  } else if (isMilk) {
    washing = [
      'Boiling & Pasteurization: Bring raw or unpasteurized milk to a rolling boil for at least 3 minutes, stirring constantly to destroy enteric bacterial contaminants.'
    ];
    warnings.push('Chemical Adulteration Hazard: Screen for synthetic milk adulterants including urea, starch, neutralizers (sodium bicarbonate), and synthetic detergents.');
    culinary = 'If milk foams excessively upon heating or has a soapy texture, do not consume; discard and report vendor.';
  } else if (isHoney) {
    washing = ['Store in airtight container at room temperature (18°C–24°C). Do not refrigerate as refrigeration induces crystallization.'];
    warnings.push('Inverted Sugar / HFCS Syrup: Commercial adulteration often blends high-fructose corn syrup or rice syrup into honey.');
    culinary = 'Perform thumb test or warm water drop test: Pure honey stays intact at the bottom; adulterated syrup dissolves instantaneously.';
  }

  return {
    commodity,
    washingProtocol: washing,
    trimmingInstructions: trimming,
    storageRules: storage,
    culinaryAdvice: culinary,
    criticalWarnings: warnings
  };
}

/**
 * Calculates Clinical Health Impact, Toxicity Risk, and Demographic Vulnerability.
 */
export function getHealthToxicityImpact(
  commodity: string,
  damagePercentage: number,
  adulterants: string[] = [],
  edibilityStatus: string = 'Safe to Consume'
): HealthImpactProfile {
  let riskScore = Math.min(Math.round(damagePercentage * 0.9), 95);
  let overallRisk: 'Safe / Negligible' | 'Mild Risk' | 'Moderate Risk' | 'High / Severe Hazard' = 'Safe / Negligible';

  if (damagePercentage <= 6) {
    riskScore = 5;
    overallRisk = 'Safe / Negligible';
  } else if (damagePercentage <= 20) {
    riskScore = 24;
    overallRisk = 'Mild Risk';
  } else if (damagePercentage <= 50) {
    riskScore = 65;
    overallRisk = 'Moderate Risk';
  } else {
    riskScore = 92;
    overallRisk = 'High / Severe Hazard';
  }

  const mycotoxins: string[] = [];
  const chemicals: string[] = [];
  const symptoms: string[] = [];
  const actions: string[] = [];

  if (damagePercentage > 12) {
    mycotoxins.push('Patulin Mycotoxin Exposure: Secondary metabolite synthesized by Penicillium expansum. Tolerable Daily Intake (TDI) is 0.4 µg/kg bw. Excessive intake provokes intestinal epithelial hyperpermeability.');
    mycotoxins.push('Alternariol & Alternaria Toxin Hazard: Common black rot pathogen producing mutagenic alternariol mycotoxins.');
    symptoms.push('Acute gastrointestinal irritation: nausea, mild epigastric discomfort, abdominal bloating');
    symptoms.push('Watery diarrhea or loose stools within 4–12 hours if necrotic fungal tissue is consumed');
  }

  if (damagePercentage > 45) {
    mycotoxins.push('Bacterial Endotoxin Contamination: Secondary opportunistic bacterial colonizers (Coliforms, Pseudomonas) in liquefying tissues.');
    symptoms.push('Bacterial enteritis: febrile chills, severe cramping, dehydration');
  }

  if (adulterants.some(a => a.toLowerCase().includes('wax'))) {
    chemicals.push('Industrial Paraffin / Microcrystalline Wax: Hydrocarbon waxes not intended for human consumption cause mechanical indigestion, delayed gastric emptying, and colic.');
  }

  if (adulterants.some(a => a.toLowerCase().includes('carbide'))) {
    chemicals.push('Arsenic Hydride & Phosphine Gas Residues: Industrial calcium carbide used for artificial forced ripening carries traces of arsenic and phosphorus.');
    symptoms.push('Chemical neurological symptoms: headaches, dizziness, dry throat, oral irritation');
  }

  if (adulterants.some(a => a.toLowerCase().includes('lead') || a.toLowerCase().includes('metanil') || a.toLowerCase().includes('dye'))) {
    chemicals.push('Non-Permitted Synthetic Azo Dyes: Metanil Yellow, Sudan I, Lead Chromate have established hepatotoxicity, renal accumulation, and neurodevelopmental hazards.');
  }

  if (adulterants.some(a => a.toLowerCase().includes('detergent') || a.toLowerCase().includes('urea'))) {
    chemicals.push('Caustic Surfactants & Urea: Alters gastrointestinal luminal pH, causing acute gastritis and metabolic alkalosis/acidosis.');
    symptoms.push('Burning throat sensation, vomiting, severe abdominal pain');
  }

  if (symptoms.length === 0) {
    symptoms.push('No acute symptoms expected under standard culinary preparation and thorough washing.');
  }

  // Recommended Health Actions:
  if (damagePercentage > 25) {
    actions.push('Do NOT consume raw or lightly cooked. Discard severely degraded portions.');
    actions.push('If consumed accidentally: Maintain generous oral hydration with electrolyte solutions (ORS).');
    actions.push('Avoid anti-diarrheal motility inhibitors without medical supervision to permit natural clearance of microbial toxins.');
    actions.push('Seek immediate medical attention if persistent vomiting, high fever (>38.5°C), or signs of dehydration develop.');
  } else {
    actions.push('Follow standard kitchen hygiene: wash produce thoroughly and trim any superficial blemishes.');
    actions.push('Enjoy with balanced dietary variety to minimize any single-source contaminant exposure.');
  }

  const demographics: DemographicRisk[] = [
    {
      group: 'Children & Infants',
      riskLevel: damagePercentage > 20 ? 'HIGH' : damagePercentage > 6 ? 'MODERATE' : 'LOW',
      description: 'Lower metabolic body weight and immature intestinal barrier increase sensitivity to mycotoxins (Patulin) and synthetic dyes. Always peel fruit skins.'
    },
    {
      group: 'Pregnant & Nursing Mothers',
      riskLevel: damagePercentage > 20 ? 'HIGH' : 'LOW',
      description: 'Patulin crosses the placental membrane; exposure to rotten fruit extracts or chemically ripened produce should be strictly avoided.'
    },
    {
      group: 'Elderly Individuals',
      riskLevel: damagePercentage > 30 ? 'HIGH' : damagePercentage > 15 ? 'MODERATE' : 'LOW',
      description: 'Reduced gastric acidity and hepatic clearance increase susceptibility to opportunistic foodborne bacterial infections from bruised produce.'
    },
    {
      group: 'Healthy Adults',
      riskLevel: damagePercentage > 40 ? 'HIGH' : damagePercentage > 20 ? 'MODERATE' : 'LOW',
      description: 'Can tolerate superficial bruising after adequate 2.5 cm surgical excision; discard if biological rot exceeds 40%.'
    }
  ];

  return {
    overallRiskLevel: overallRisk,
    riskScorePercent: riskScore,
    mycotoxinHazards: mycotoxins,
    chemicalHazards: chemicals,
    demographics,
    symptomsToMonitor: symptoms,
    recommendedActions: actions
  };
}

/**
 * Knowledge Base for interactive Precaution AI queries.
 */
export function answerPrecautionQuestion(
  question: string,
  commodity: string,
  damagePercentage: number
): { question: string; answer: string; severity: 'info' | 'warning' | 'danger' } {
  const q = question.toLowerCase();

  if (q.includes('boil') || q.includes('cook') || q.includes('heat') || q.includes('bake')) {
    if (damagePercentage > 25) {
      return {
        question,
        answer: 'Cooking or boiling destroys live mold hyphae and bacteria, but it DOES NOT neutralize fungal mycotoxins like Patulin, Aflatoxin, or bacterial enterotoxins because they are heat-stable up to 200°C. You must surgically cut away damaged necrotic tissue before cooking.',
        severity: 'danger'
      };
    }
    return {
      question,
      answer: 'Standard thermal cooking and boiling kills surface microorganisms effectively. However, always wash and trim any bruised tissue prior to heating.',
      severity: 'info'
    };
  }

  if (q.includes('wax') || q.includes('peel') || q.includes('skin') || q.includes('remove')) {
    return {
      question,
      answer: 'To remove artificial wax coatings at home: Soak the fruit in lukewarm water with 1 tbsp baking soda and 1 tbsp lemon juice for 12–15 minutes. Scrub gently with a vegetable brush and rinse under cold water. Alternatively, completely peel the outer skin to remove 98% of wax and superficial pesticide residue.',
      severity: 'info'
    };
  }

  if (q.includes('child') || q.includes('baby') || q.includes('infant') || q.includes('pregnant')) {
    if (damagePercentage > 15) {
      return {
        question,
        answer: 'Strongly Cautioned: Children, pregnant women, and nursing mothers should NOT consume produce with active necrotic decay, even after trimming. Fungal hyphae branch invisibly through pulp, and mycotoxins can permeate beyond visible blemishes.',
        severity: 'danger'
      };
    }
    return {
      question,
      answer: 'For children and pregnant women, peel the outer skin completely and wash thoroughly under running water to eliminate risk from surface chemicals or dyes.',
      severity: 'warning'
    };
  }

  if (q.includes('juice') || q.includes('smoothie') || q.includes('puree') || q.includes('blend')) {
    if (damagePercentage > 15) {
      return {
        question,
        answer: 'DO NOT JUICE: Juicing or blending damaged fruits disperses concentrated fungal spores and Patulin throughout the entire liquid volume. Commercial standards mandate that fruit with over 10% rot must never enter juicing streams.',
        severity: 'danger'
      };
    }
    return {
      question,
      answer: 'Safe to juice only after thorough washing and peeling. Ensure the blender and cutting boards are sanitized.',
      severity: 'info'
    };
  }

  if (q.includes('store') || q.includes('fridge') || q.includes('refrigerat') || q.includes('freeze')) {
    return {
      question,
      answer: 'Storage Protocol: Isolate damaged produce immediately. Keep sound produce refrigerated at 4°C with 85% relative humidity. Never store bruised apples or bananas with other fruits because they release ethylene gas and mold spores that accelerate spoilage of adjacent items.',
      severity: 'info'
    };
  }

  if (q.includes('carbide') || q.includes('artificial') || q.includes('chemical') || q.includes('ripen')) {
    return {
      question,
      answer: 'Calcium Carbide Test & Hazard: Carbide-ripened fruits (especially bananas and mangoes) display unnatural uniform bright yellow peel with green tips and sour/bland pulp. Carbide contains trace arsenic and phosphorus hydrides. Wash peel meticulously and never eat the outer rind.',
      severity: 'warning'
    };
  }

  if (q.includes('test') || q.includes('home test') || q.includes('milk') || q.includes('turmeric')) {
    return {
      question,
      answer: 'Household Adulteration Tests: For milk, drop a sample on a tilted glass plate; pure milk leaves a trail, adulterated water milk flows immediately. For turmeric, mix 1 tsp in warm water; pure settles to leave clear water, while chemical dye turns water cloudy fluorescent yellow.',
      severity: 'info'
    };
  }

  // Default response tailored to current sample:
  return {
    question,
    answer: `NutriScan AI Dew Safety Directive for ${commodity} (${damagePercentage}% damage): Always perform thorough washing with 1% baking soda solution, trim at least 2.5 cm around any bruised or discolored tissue, and never consume produce with internal mold or off-putting odors.`,
    severity: damagePercentage > 30 ? 'warning' : 'info'
  };
}
