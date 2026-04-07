export type BodySystemId =
  | "cardiovascular"
  | "digestive"
  | "endocrine"
  | "immune"
  | "integumentary"
  | "muscular"
  | "nervous"
  | "reproductive"
  | "respiratory"
  | "skeletal"
  | "urinary";

export interface BodySystemDefinition {
  id: BodySystemId;
  title: string;
  color: string;
  thumbnail: string;
  description: string;
  organIds: string[];
  detailBodyPartIds?: string[];
}

export const BODY_SYSTEMS: BodySystemDefinition[] = [
  {
    id: "cardiovascular",
    title: "Cardiovascular",
    color: "#e87722",
    thumbnail: "/assets/systems/cardiovascular.webp",
    description: `Anne had been experiencing chest pains during her recovery. While she was never diagnosed with actually having a heart attack, some opioid analgesics, including morphine and meperidine, have been associated with a small increased risk of myocardial infarction or heart attack. The risk of heart attack was also found to be increased in patients who were taking multiple opioid analgesics at one time, as Anne was doing.`,
    organIds: ["heart"],
  },
  {
    id: "digestive",
    title: "Digestive",
    color: "#8061bc",
    thumbnail: "/assets/systems/digestive.webp",
    description: `Some of the most commonly known side effects of opioid analgesics relate to the digestive system. People taking opioid analgesics will often complain of nausea, vomiting, and constipation. These symptoms are caused by several mechanisms. Opioid analgesics increase the amount of time it takes for food to pass through the stomach, leaving a feeling of fullness long after meals. Slower digestion can lead to constipation. Opioid analgesics can also have a direct effect on the vomiting center of the brain. In Anne\u2019s case, the opioid analgesics she took caused extreme difficulties with constipation.`,
    organIds: ["stomach", "intestines", "gallbladder", "liver"],
  },
  {
    id: "endocrine",
    title: "Endocrine",
    color: "#a32a2e",
    thumbnail: "/assets/systems/endocrine.webp",
    description: `Opioid analgesics have the potential to affect the hormones of the body. Since hormones have a role in weight control in addition to bone and muscle health, Anne\u2019s risk of weakness increased resulting in multiple falls around her house. Decreased bone and muscle health placed her at a higher risk of not only falls, but also bone fractures.`,
    organIds: ["thyroid", "pancreas", "thymus"],
  },
  {
    id: "immune",
    title: "Immune",
    color: "#b1b3b3",
    thumbnail: "/assets/systems/immune.webp",
    description: `Immunodepression or a poorly functioning immune system places people at higher risk of having an infection. Some opioid analgesics, including morphine, fentanyl and codeine, have been found to increase the risks of pneumonia in elderly patients.`,
    organIds: ["spleen", "thymus"],
  },
  {
    id: "integumentary",
    title: "Integumentary",
    color: "#f2b411",
    thumbnail: "/assets/systems/integumentary.webp",
    description: `The Integumentary System, predominantly comprised of the skin, can be affected by opioid analgesics and medications applied to the skin. In Anne\u2019s case, one of the opioid medications she used comes in the form of a patch that is directly applied to the skin to allow for slow opioid absorption over time. The patch she used caused an allergic reaction and resultant rash that required the medication to be discontinued.`,
    organIds: [],
    detailBodyPartIds: ["bp_skin"],
  },
  {
    id: "muscular",
    title: "Muscular",
    color: "#078576",
    thumbnail: "/assets/systems/muscular.webp",
    description: `Anne had developed depression and excessive fatigue from her pain medications, specifically the opioid analgesics, to the point that she was no longer an active woman. Most of her days were spent reclining in a chair at home to the point that her muscles became weak and her overall endurance declined. Beyond the resultant inactivity, opioid analgesics affect the body\u2019s hormones and can further negatively affect muscle mass and strength.`,
    organIds: ["muscle", "knee_joint"],
  },
  {
    id: "nervous",
    title: "Nervous",
    color: "#627d32",
    thumbnail: "/assets/systems/nervous.webp",
    description: `The central nervous system, made up of the brain and spinal cord, is particularly vulnerable to the effects of opioid analgesics. For instance, opioid analgesics have been found to increase the likelihood of either developing depression or further worsening preexisting depression. Depression is often, unfortunately, accompanied by social isolation and sleep disturbances, either insomnia or excessive daytime sleepiness. One physician\u2019s examination of Anne revealed that, "her speech was slurred and it was hard to keep her awake to carry on a conversation." Furthermore, opioid analgesics have the potential to over-sensitize the brain, leading to a condition where patients have actually had increased amounts of pain. This condition is called opioid-induced hyperalgesia. Finally, we cannot forget about the risks of dependence and addiction that frequently accompany opioid analgesic use.`,
    organIds: ["brain"],
  },
  {
    id: "reproductive",
    title: "Reproductive",
    color: "#005e9d",
    thumbnail: "/assets/systems/reproductive.webp",
    description: `Due to the effects that opioid analgesics can have on the endocrine system and the body\u2019s hormones, both men and women are at increased risk for reproductive system abnormalities. Women, for instance, are more prone to menstrual irregularities and carry a two-times higher risk of having children with birth defects. Men and women are both at higher risk for sexual dysfunction and problems with intimacy.`,
    organIds: ["male_reproductive", "female_reproductive"],
  },
  {
    id: "respiratory",
    title: "Respiratory",
    color: "#422c88",
    thumbnail: "/assets/systems/respiratory.webp",
    description: `Due to the number of opioid analgesics and potentially deadly combination of muscle relaxants and opioid analgesics, Anne was at a high risk of overdose and respiratory depression. Opioid analgesics decrease the brain\u2019s ability to sense high levels of carbon dioxide in the blood and also diminish the amount of air breathed in by the lungs. This is the most common way that people die from opioid overdose \u2014 their breathing slows down, their breathing stops and they ultimately suffocate.`,
    organIds: ["lungs_left", "lungs_right", "larynx_trachea"],
  },
  {
    id: "skeletal",
    title: "Skeletal",
    color: "#90bc53",
    thumbnail: "/assets/systems/skeletal.webp",
    description: `The body\u2019s skeletal system is in an almost constant state of turnover. That is, older bone tissue is broken down and stronger bone tissue is formed, resulting in stronger bones. Opioid analgesics have been found not only to impair this process by having a direct effect on bone-generating cells, called osteoblasts, but also negatively affect the hormones of the body that help regulate bone growth. Anne\u2019s cognition was significantly impaired by her medications, causing her to fall multiple times. While she did not directly sustain any fractures, she was at a much higher risk for bone injury as a result of the opioid analgesics being taken.`,
    organIds: ["knee_joint"],
  },
  {
    id: "urinary",
    title: "Urinary",
    color: "#e87722",
    thumbnail: "/assets/systems/urinary.webp",
    description: `The ability to void or urinate can be affected by opioid analgesics as it was in Anne\u2019s case. She had developed a condition called urinary retention or failure to completely empty her bladder. Opioid analgesics can decrease the sensation of a full bladder by limiting the amount of discomfort that is noticed. They can also cause increased resistance to urine flow out of the bladder. Both situations, as well as more complicated spinal cord involvement, can result in urinary retention that, when left untreated for long periods of time, can contribute to urinary tract infections and kidney damage.`,
    organIds: ["kidneys", "bladder"],
  },
];

export const ORGAN_TO_SYSTEM: Record<string, BodySystemId[]> =
  BODY_SYSTEMS.reduce<Record<string, BodySystemId[]>>((lookup, system) => {
    system.organIds.forEach((organId) => {
      lookup[organId] = [...(lookup[organId] ?? []), system.id];
    });

    return lookup;
  }, {});
