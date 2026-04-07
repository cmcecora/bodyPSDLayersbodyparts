(function () {
  const BODY_SYSTEMS = [
    {
      id: "cardiovascular",
      title: "Cardiovascular",
      color: "#e87722",
      thumbnail:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAEHCAYAAACjq4OnAAAACXBIWXMAABcRAAAXEQHKJvM/AAAOIElEQVR42u3dPW4r1xmAYS9BS9AStAQtgUsgvAIiK9AGAhDpAjcC4i6FhXRJJcONmyBq7MpABDdJFahIcX2vbYaHHjn03KE4JGfO7zPACwO275Ugznl1vp/znU82m80nANDHDwEAOQAgBwDkAIAcAJADAHIAQA4AyAEAOQAgBwDkAIAcAIAcAJADAHIAQA4AyAEAOQAgBwDkAIAcAJADAHIAQA6ohHd/WFxvud2y2HLX8bDlcY+XLZsRPPX+3Lr7+1bd17j1MycH5CeBmy3LbrE+dgt5k4iX7nu4776fII4rnxM5IM5uYNH95n5MKIFTee52LSu7DHLANDK46nYF990C21TEY7e7uPFZkwPGhwl3icODFOHIfSdCYQg5oCeEdYW7g3N5IApyaD1/cEcIo0Sx8M6QQwtSWBaWTMwp9Ai7q2vvETnUuEt4scgnS2baTZBD8VK4t5hnLZEuvWvkUJIUboUO0UOOOwlMciAFkAQ5FBU+PFicWUlCuEEOyTsY5RTyzklIXJJDdDGoPpRV3dCmTQ5R8goal8pkLR9BDkIICDXIIYoYFkKIKtuy7SLI4aLdgipE3VUNuwhyOCu3YLfQBvd2EeQwVgxrC6bJXISKBjm82cz0ZKE0zcpaIAdhBIQZ5HBUDCsLAgPj+K/JoW0x6F3AW9WMG3Jos0wpv4AxLMmhrYGuxIBTuCOHNsQg8YizEpXkQAwAQbQih27qs5cbU1UyrsiBGIBmBUEMAEG0JQdiAEGQw6Hko5cXUWZDkIOqBNBUFYMYAIKoWw5aoqHVmhyIATmzIAenK4GqT3OaxwDMM3buihzST3DyMiLLm7bIIe3MR5UJZH3LFjmkkYMEJCQoycH4eBSdoLwmB3kGoJr8Q4n9DPIMMGqOHD6Sg7srUTI35DDfbddeMBR9xJschBNA8eGF9mgc5Ic/323e/+X3v+GHP/3Oz+ZyrslBdSJ/AWwX+/u//XHz4z/+uvnp3//c/Pyff23GPD//92X3/4c/FyTiZ1lf9aIEOTx7mSbks083H778fPPjd3/fLfCpnvB3hb/Xz7ie4925i+HOSzSdEH76/tvN3E/YeQg9RjdHXZGDJGSykCHsEDbv322iPtuvJ9QoPzkpCVmzFBI+IcwIOxafR7nJyZxPXDaxiD98/cUvicC9+P/XZN83X+2Shaf8nSFBGH2ncOAJ34vFX+7sSZ2QiQg5gNGLePv/7RbaW7+Jt/8tCCWnZ7d7sPiL7ZxUukzEOb/dQ6hwSAxjS5BzSSB8b2EXFHohhBN1lDZzlMNjC9WDyZJ8icSwE4Iehym5JQe7ht1v11Of8Fs5BzGE0GW3O7CYq9892DUUIIewIAeTjxErEqTQ3u5BhSIBu4rCCc9QU1HYScTqWRjctbx1FqNrxw6ExOvruQy5iLIqF/oaMpdDKGcOlUBjlCuPdTsGGYTv76Qqyfb7diajjL4Hu4YEjG5j3i6kod+2MUqWu8rIwNfeNVhtF/ZU5zJeE5t2FfntHpyhSCGHkYt7qIkobNmjiGEg+Rl2CXPuUggirzMXucjhhRw+foYWy5QnKccmP3f5jQhhzME+jvZYkcMvYli29uGfu1B2XZUxz0OErssIJzmPCbFBnsmhofLlqXIYStbN3dOwX6oMX3/uXcpgP4eZENmUNSUiExy2GhV/T9A4de6WPogh1eEth7XySUxKRGbYADXUVzB3w9NryTKlGN5q+JKYbE8Oz+QwounpnLMYpyzI77+N2j9BDmWMkksphpsWP/BjScWhkGLuRORuZkTik53kMMhDq3Jo8jLcY92RQzH33BWD3fc1Yw+DnMNFXLUoh2dyeLticEp149IDVbk8qhX5hBZCithyOJJYTFGlyGmClMnV+YQWqhQZdUcOxdunnuA8Z+eQyzOUb8Fu59iUHJ7IYWS+IbO5kLMnRslgiEUTcujuo2j2g36rIjC0OFp5nKt4k3Urclg2vkUcHW/vGpKq2hr8f5bDPpKQeZ61MNQlFzmE2Q2Rk5GxhBDKpAa7lDcERgkzEzkMJSOLlsPrXRsWdbElTQetYh66eiNMGBoHV6ocdqJz9Lr4g1ix5bBo+QN+a7EP/ZYdc4JTYrEZnmqXw5ocDtT3D/ymLekZO6UaZbRSG+ySWA7HbqO2Y0CqATCx5dD0h/vR6cpDV9wV1gTlJGU07qqUQ8vnKQ61Qo+5QSrmrVbnViWGdj4hxHgdMxf+qfuxvHMWmp8SyeFQma/fCDX3LIc5TlEeOv4t9CirGcphqwRyOHj3ZegY7JU0c65YnDOYRu9DOYewJCNjyyHkGQaOJb9eVrNLUEa+q2Kqg1Jjx8xply4jKekkZkw5bHcFB/sZ9hZVf9HNfWz7rF3DgMROSZ4SRP4nNFUqIg96GVOR6IcdOYYW/Z6Gk6/pG1GpQdqKhbbp1OXNcNXc0NrpVTJi3zx17OmHRmeFPgcqHcijjTqWHG59qAOEkfMHYvT+7iGncxb9ROQl35seiZN5rE0OCx/qGcNme7mHXBqi+nmTS3sxVDDyPGOhjJnhruFQa3Uuw1/60priIpwxDWGIW84kh8xyDceOcufQMbmfbzg5ETlShGhHDg8+1PN7F/az+jlcWTdXmVV4MZqbmuTw6AM9fzZkPwGYsu+h398wdR7EvRX5NEKRQ6JmqJN/q/bCi1Rdk/3qwtS7GNULchBSXJi0S3Ug6yM5zJHwlJxsSg4vPtDLux37SbsUt2Lvy2Guzk27h6OsapKDD3Si3/j74UWKxqj9/MecX9/uIX0LNTkkOF8x5cJJkXuIIQe7B3Jojimy+/vhRYrcw+vXnnvnonJBDi61uSS8CJ2WsTsku53L3HIYussD5FBvy/QMizR21+SvzUpzi2ngikCQQ3OX2lySHIwdWuwnJWOf4wA5kMPIZzd0JUFo8ZoPmDshaigtOZDDJVvvrRxiVy1eQ4vZj5ELLcjB/IbLFmr0WQ/doo1xzsM4ubrl8OQDnXEhhevuzzivMYWUpjqyfTR08v5EHzLrbEUNcugEEb+m+S7K8NswP9P74+AVORT2hIUr70AO5BBp+lNpT4wDYLol65XD2gea1wTp0h4HsX7D1cYMSXLw9LoysdlUNkNy5UMlB81Qk/BSmxxcahOp3bjWxxHuei+1IQdyuDjp6f2pUA66JBdJR7vV8nh/KrxId2OOZLYX4pKD+ZE5yEGvQ6WNUORQX49DbDnc+2BVLC6Sg+vyovU4xJaDXgdJSY1QhZQxY8tBxUJSkhwKqVTElsMVMcg7kMNFrKuUQyeIZ3I4/SJdDzl0LGuWwwM5pL0It+THRKjFTc1ycMZCaKGUWUAyMoUcJCVnvoSWHCQji5SDNurp780kB23TNclBp6SGqDOykc2PirttQQ6aoSa+WLeFp/Uj27HXaSo53JCCsiY5nMRDE3LYOKEp90AO2Z7EzEEODmH1b99Oce8EOZTCdUtyWJJCLzkZ4eYociiS5xRrNKUcnLMwCOakp+EBs+um5KCV+nB44cTmATm0O5r+pkU5CC0OVS/kH8ghcUiRWg5CC81R5JBpSJFUDkKLI/dqfvk5I5DDTctyWBABQZDDIE8p12ZyOWiIGikIOYgWqxUrcnADtySlPoekU6ZzlsM1AYyb/9BymbMxOdynXpdZyGHjGPdp5zC++YocHM9uSg4SkyeWOlubQdmQHJ5yWJPZyGFjMvVZ3ZQt7SIaksOSHHRMTpasbGFgTCNyeM5lPWYlB2XNy0911hxqhENpypdty8EIuQn6ImrcSTTQBPWSQ/kyZzlc2T1Ml7SsacJUA3K4y2ktZicHu4d5Epcfvv6i+B6JsCOyayAHu4cZG6lKFUXlV+Flt2vIUg4qFxFFEfITYfpU5q3ZIdGqQkEO+h4SlkTDriLIIreqR+X5hiU56JosbmcRyqNhYSatfoSbrj77VDckOThzkf3uYhuKhM7MKHmLrRgqzzXckoPbseoumYbdxdS5i/rF8JDz2steDhvzHsoPR84Qxm6wS72hxGvp8pocpiltSk4W3msRdhgh4RmkEcKSII5f2e46wr8PUqlcClm2SRcrB8lJSEKSg0nVMFGaHHROoknuSllvRclBeAHhBDkcE8S9Fw0FViduyEH1AiiyOlG8HDRHQbMTORwTxMqLh9xPXOY4p6F6Ocg/QJ6BHI7lH568iHAUmxwOXaen/wE5sS59XVUhBwlKSECSg9FyyL7RqeQEZLVyMLkaJkiTgwoGVCbIgSBADOQwvSCUOBGDRa1rqGY56IGAXgZyIAgQAzkQBIiBHCYWhDFzmCL5uGhhzTQjB1UMqEqQA0GAGMhBqzW0RJPDfMNqnebEm4eoWhVD03LYO81pHiWqPXZNDpdXMtzmjf38wrL1dUEOLuzFxzMfb6wHcpCHgPwCOZw8dk6Y0VYYsfLuk4PBMeiXKYUR5HB2NcO5jDq5846Tg10E7BbIQS4CcgvkkLb1WkWjvErEtfeXHGI1Tgk1ygghbr2z5JAq1HDKM89mJl2O5JBNVUM+Io+8gioEOWQpiVuSSCcFHY7kUIokhBtxwocVKZBDyTkJ1Y3pE41yCuRQTXVjZXbExdxrYCKHFkIOu4nxuwShAzk0t5tYGpl/MJewtksgB6IgCkIgB5wwdGbdQI7ioQsZtDaTA86seCy7PMVT4b0Ij10/gpZmcsBMIchtt8geMhXGqwjWndiECuSAxC3ci04a993ifIoggNfdwKqTlhCBHFCgPG73WHWL+hiL3p9TUiQHAOQAAOQAgBwAkAMAcgBADgDIAQA5ACAHAOQAgBwAkAMAcgAAcgBADgDIAQA5ACAHAOQAgBwAkAMAcgBADgDIAUBr/A9YO/PHz68W8AAAAABJRU5ErkJggg==",
      description:
        "Anne had been experiencing chest pains during her recovery. While she was never diagnosed with actually having a heart attack, some opioid analgesics, including morphine and meperidine, have been associated with a small increased risk of myocardial infarction or heart attack. The risk of heart attack was also found to be increased in patients who were taking multiple opioid analgesics at one time, as Anne was doing.",
      organs: ["heart"],
      keyParts: "Heart, Blood Vessels, Blood",
      processes: [
        {
          category: "Heart Function",
          items: [
            {
              name: "Cardiac Function",
              desc: "Powers efficient blood pumping throughout the body",
            },
            {
              name: "Healthy Blood Pressure",
              desc: "Maintains optimal force against vessel walls",
            },
          ],
        },
        {
          category: "Blood Vessel Health",
          items: [
            {
              name: "Arterial Health",
              desc: "Keeps arteries elastic and flexible",
            },
            {
              name: "Vasodilation & Vasoconstriction",
              desc: "Widens and narrows vessels to regulate blood flow",
            },
            {
              name: "Venous Return",
              desc: "Returns deoxygenated blood to the heart",
            },
            {
              name: "Angiogenesis",
              desc: "Forms new blood vessels for growth and healing",
            },
          ],
        },
        {
          category: "Blood Components & Function",
          items: [
            {
              name: "Oxygen Transport",
              desc: "Delivers oxygen to tissues and returns carbon dioxide",
            },
            {
              name: "Red Blood Cell Production",
              desc: "Creates cells that carry oxygen",
            },
            {
              name: "Blood Clotting",
              desc: "Prevents excessive bleeding while avoiding harmful clots",
            },
            {
              name: "Platelet Aggregation",
              desc: "Clumps platelets to form clots when needed",
            },
            {
              name: "Blood Volume Regulation",
              desc: "Maintains proper amount of blood in circulation",
            },
            {
              name: "Hemoglobin Synthesis",
              desc: "Produces the protein that carries oxygen in red blood cells",
            },
          ],
        },
      ],
    },
    {
      id: "digestive",
      title: "Digestive",
      color: "#8061bc",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "Some of the most commonly known side effects of opioid analgesics relate to the digestive system. People taking opioid analgesics will often complain of nausea, vomiting, and constipation. These symptoms are caused by several mechanisms. Opioid analgesics increase the amount of time it takes for food to pass through the stomach, leaving a feeling of fullness long after meals. Slower digestion can lead to constipation. Opioid analgesics can also have a direct effect on the vomiting center of the brain. In Anne’s case, the opioid analgesics she took caused extreme difficulties with constipation.",
      organs: ["stomach", "intestines", "gallbladder", "liver"],
      keyParts:
        "Stomach, Small Intestine, Large Intestine, Colon, Rectum, Anus, Liver, Gallbladder, Pancreas",
      processes: [
        {
          category: "Digestion & Absorption",
          items: [
            {
              name: "Digestion & Nutrient Absorption",
              desc: "Breaks down and absorbs nutrients from food",
            },
            {
              name: "Peristalsis",
              desc: "Creates wave-like contractions moving food through the digestive tract",
            },
            {
              name: "Gastric Acid Secretion",
              desc: "Produces stomach acid for digestion and pathogen defense",
            },
            {
              name: "Bowel Motility",
              desc: "Moves contents through the digestive system",
            },
          ],
        },
        {
          category: "Liver Functions",
          items: [
            {
              name: "Detoxification",
              desc: "Removes toxins from the body",
            },
            {
              name: "Bile Production",
              desc: "Creates bile for fat digestion",
            },
            {
              name: "Urea Cycle",
              desc: "Converts ammonia to urea for elimination",
            },
            {
              name: "Hepatic Gluconeogenesis",
              desc: "Produces glucose from non-carbohydrate sources",
            },
          ],
        },
        {
          category: "Metabolic Processes",
          items: [
            {
              name: "Healthy Metabolism",
              desc: "Converts food into energy",
            },
            {
              name: "Blood Sugar Regulation",
              desc: "Maintains stable glucose levels",
            },
            {
              name: "Insulin Sensitivity",
              desc: "Ensures proper response to insulin",
            },
            {
              name: "Glycogenolysis",
              desc: "Breaks down glycogen to release glucose",
            },
            {
              name: "Gluconeogenesis",
              desc: "Forms glucose from non-carbohydrate sources",
            },
          ],
        },
      ],
    },
    {
      id: "endocrine",
      title: "Endocrine",
      color: "#a32a2e",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "Opioid analgesics have the potential to affect the hormones of the body. Since hormones have a role in weight control in addition to bone and muscle health, Anne’s risk of weakness increased resulting in multiple falls around her house. Decreased bone and muscle health placed her at a higher risk of not only falls, but also bone fractures.",
      organs: ["thyroid", "pancreas", "thymus"],
      keyParts: "Pancreas, Thyroid Gland, Adrenal Gland, Pituitary Gland",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Hormonal Balance",
              desc: "Regulates insulin, thyroid, sex, and adrenal hormones",
            },
            {
              name: "Endocrine Signaling",
              desc: "Produces and releases regulatory hormones",
            },
            {
              name: "Growth Factor Signaling",
              desc: "Communicates for cell division and tissue repair",
            },
            {
              name: "Appetite Regulation",
              desc: "Manages hunger signals and satiety",
            },
          ],
        },
      ],
    },
    {
      id: "immune",
      title: "Immune",
      color: "#b1b3b3",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "Immunodepression or a poorly functioning immune system places people at higher risk of having an infection. Some opioid analgesics, including morphine, fentanyl and codeine, have been found to increase the risks of pneumonia in elderly patients.",
      organs: ["spleen", "thymus"],
      keyParts: "Lymph Nodes, Spleen, White Blood Cells",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Immune Response",
              desc: "Defends against infections and foreign substances",
            },
            {
              name: "Inflammatory Response",
              desc: "Initiates defense and healing processes",
            },
            {
              name: "Lymphatic Drainage",
              desc: "Moves lymph fluid to remove toxins and transport immune cells",
            },
            {
              name: "Leukocyte Function",
              desc: "Enables white blood cells to fight infection",
            },
            {
              name: "Phagocytosis",
              desc: "Allows cells to engulf and digest foreign particles",
            },
            {
              name: "Immune Tolerance",
              desc: "Prevents attacks against the body's own tissues",
            },
          ],
        },
      ],
    },
    {
      id: "integumentary",
      title: "Integumentary",
      color: "#f2b411",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "The Integumentary System, predominantly comprised of the skin, can be affected by opioid analgesics and medications applied to the skin. In Anne’s case, one of the opioid medications she used comes in the form of a patch that is directly applied to the skin to allow for slow opioid absorption over time. The patch she used caused an allergic reaction and resultant rash that required the medication to be discontinued.",
      organs: [], // No corresponding organ in SVG model
      keyParts: "Skin, Hair, Sweat Glands, Sebaceous Glands",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Skin Regeneration & Repair",
              desc: "Renews skin and heals damage",
            },
            {
              name: "Sebum Production",
              desc: "Lubricates and waterproofs skin and hair",
            },
            {
              name: "Sweating & Thermolysis",
              desc: "Cools the body through sweat evaporation",
            },
            {
              name: "Melanin Production",
              desc: "Pigments skin and protects against UV radiation",
            },
            {
              name: "Thermoregulation",
              desc: "Maintains internal temperature despite external changes",
            },
            {
              name: "Wound Healing",
              desc: "Repairs and regenerates tissue after injury",
            },
          ],
        },
      ],
    },
    {
      id: "muscular",
      title: "Muscular",
      color: "#078576",
      thumbnail:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQcAAAEHCAYAAACjq4OnAAAACXBIWXMAABcRAAAXEQHKJvM/AAAY+0lEQVR42u2dy2quW5WGvYRcQi4hvermDswlBDf2g4W2lxZURzek4Xbb0R2hwBO4UxS1wAMSxQMWImkIigi1oAo7Kiy0Ibb+WiP+73I4ap6+P8n/fXPOJ/CysnLee2U83zi8c8yP7Ha7jyCEUBT/ExBCwAEhBBwQQsABIQQcEELAASEEHBBCwAEhBBwQQsABIQQcEELAASEEHBBCCDgghIADQgg4IISAA0IIOCCEgANCCDgghIADQgg4IISAA0IIOCCEgAMa5R/1Xz55+kbnb3TxRi/2un2jO6fXb7Rr0H34vOv917vaf49z/p8DB7Q9CJy90eU+WO/2gbxbSa/3P8PN/ucxcJzw7wQc0HGygYv9k/tuRQgs1at91nJFlgEc0NPA4GSfFdzsA2w3kO722cUZ/9bAAbWXCS9WLg/WKEdu9iCkDAEOKADhesDs4FDdAgrgMHv/4AVAaALFBb8zwGEGKFx21kzcUulh2dUpv0fAYcQs4TVB/mTNTLIJ4NA9FG4I5mcdkV7yuwYceoLCOaXD0UuOFzQwgQNQQEACOHRVPtwSnJuCBOUGcFjdwUhPYds9CRqXwOHoYGD60Nd0A5s2cDhKXwHjUp+6ph8BHCghEKUGcDgKGC4oIYa0ZZNFAIdHZQtMIcaeapBFAIeDegtkC3PohiwCOLSC4ZqAmbIXwUQDOBTNTPcEytS6IhaAA2UEoswADlUwXBEQKLGO/xQ4zA0GvAuoNM04Aw5zjinpL6AWXQKHuRa6Aga0RC+AwxxgoPGIDmpUAgfAgBCAmAUO+63P/HKjp5pknAAHwICOqH9699O7T3z1y7uP37y/u3j/cwACOAAG9Mnd57/zH7uXv/iv3c9+86vd/X//dvfjX/8SQAAHwDC7/vXfv/EgA8If//ynhz/fffnhAyQoMYDDczQfCbxOZDD43H9+6y0YvvnTH+6+c//z3W9+9z+7T339K5vfDQEcmEqgZ5IgYC9WXnzrZz96AIW9zd7HFAM4AIbJ4fC/f/j97ovfffnwd8sgDBSCBIAADliiJ4WDZQv2pwHBXqwHYT0H+3sn2cNwVmvAgFaXZQwGB+szCBL//NUPHiDx0S98dveXv/61l+xhN9LqOU5XotVlLwYFk2ULBgnLGAwa9qeVGCZOcwIH9jFMCgeVEAKFQcJgoWblxn0Pce3cCXBYf4MTAdaxzA0pOKgpqSmF+g/mnLTGpH1MTzdtAYd1dz4ymehcygoEB3sRJAQOa05aFmG9h95u2QIO68CBBuQAMihEOFimYC8qOazfoPcZKDr7b7wADqyPRwfIegoyPwkAgoLGnFZS2OuWOXRgqU41KE+BA30GtFAW8Go2xozBygrBw95vGYQyi87+O++Aw3H8DPQZBmtGKjPQ3wUHyyRUdlhmoQal/cmqOeAQ4cDdlQPpKz/43tuegr0eywoPB2tIWvZgLx2WFtIZcHi+264JqsGckfbybz/6/gMIUnDQ2+xj7e2WZXRaWjwc8QYOlBOoImUB9vKl73+7Cge9XX2HTkuLrsoL7NFo1ZLCSgSTwUL+hhwc7HX/eR3/958CB6YTKCOVB5YByNykQ1c5OPhxZ4eGqO6mFz3A4RXBNN5aOAW4va5sQQevVHJEOMg+rRebbnCT1qRwsPqMYBpzf4MmEFom6/c6eBu1vA++lFDW0dlZi5Q56gQ40IRE4SyFvdgaenuxPoKmF1Y6KLPQDge9qOQQXDrvO2y+OUkTEq3Sa7BsQR4GlQfR2xDLCvUZLOMYoO+w+ebklk9cEkyDTijs5WMfvPcQ3ApwP8bUuNKg4eGg9wseA/QdNr17EickOpqvQecofNag0sDAocakzFGxDNHbVHZ07nfYvHOS0SU6ahPSZw0+uH1j0oMgwiE3wehcd8ChDQ53BNO45YSWyOpFq98MFt7HoMNYNTh0tJm6pnPgQNYw5clLNRDfcVmDygh9jI0tBRIFfQoOfrw5SFNyk9kDWQN6NlkQCwT+LorYL7BsQqDQ+wUHn3WkxpsqP8geBoYDE4rxwKDGohqPvpFo0NDJSr88NvYSfAmSg0NHd1p0NbnA14Ce9Ti2QGCX08jjoImFLxustPDwEBzkaSjBocO9kl34Hsga0JNLPgUfvPFtakTa29V89B8jCPgpRw4Og0wsNpc9cIYCPSsY7MnvMwLvbVBjUfZp358QPCaEw2bOXGwFDpyhGKDH4JuNaip681MMcPUT7GMiQPR140sKDgONM6Ur4PA3MFwSXGM1H+VTsD5DfLt6DZpkKIvwGYeC3W+LmgwOr4AD48shfAwRABb09vZYYvhywR+u8r4FlSIpj0PONTkgHDYx1qQRiR51/DqWDJo8RH+C7w0oa1AjMn6s/A9xjJmDw0BGqE01JmlEooOUCtx4v0QsM+LnCgJ+xOmzi9jDiCc4BzVCbaYxyQo49OjGoweDZQ2pbEK9AvURBIsIEg+RCA2VD7mMYkBdTgkHO6ZKsPVXRsSAbQGDHzVqNKmsIY4qfcMyvqh5OREcbmeFA5fhDlBGKNBTI0t/uMrvYciduPTQiKNND5kIlIHhsFuztKCkQIunETGYU6NM9QjUP/CHsHJZg7/JKtqmvU069b0G/je4nAoOlBT9ZwtaK58DQzzzIBAok0hlDX5hbKp88bsmJ4LD7WxwYErRcbYgH0MJDLJEx1GlGpOp4FdGkTI/5caYE8BhNxsc7gnC/rIFPfkNDKZcc1JNxRjMygxSo05fUqQ8Ern9DjPA4Y0upoDD/j4KArGjSYQHgwVwbioR3Yq+San+Q1wAkyopUtmImpEp1+UEcLieBQ6cpdiYbyEXcKlsoAQGwSN13kJlRqrR6PsTuZKiVI5MAIdXs8CBpS4bkS6xrb0osEsf78EQ3Y1xV2SLezIV/Dlw+HHpwDqdAQ6MMDfQcEyNEVONRz2xc32CFBhiJqIpQ6556U1Sqcyg1qsY9ODV6iNNDlpNVkLUGo4+4P22pkPBoMDPNRL9LsmU8clnLjnb9iRwuBkdDhcE6TqywKs1HFMW5lKGEcEQn+xK93PuyZy1OnXMO2Wnjke8B9f96HDAMn1kWWDlnripp7i8BjWvQw0M3h2ZC3qfNdT6CTl/w4Br4jZjpWaxy8CydLyl4ej9C8oySp9nmUUJDLWdDKmgzpUuKilKcBjkvszNLYA5NhwI2g04HEvBXrNMe+djDgxqIOamE61Zg4xRpi9+92X2Ywa6t6KmF0PCgfMU22o4xjKipb8Qr7tPPe2tr6GALvU4/NM+V/ao92FA+syHX8t+LZUvE+h2VDhgflrZ4ZibRpSMTbmaPlcGCCC1CUfKXp3LCAweuWnHBAao1cxQHLYaIFvIuQ5buvuloDPYxGyhFPjKBkqeCA+QUrPS73yIN3NPOMZc5RAWzciJegs6Zt1SRlhA+qZjbgX9Ent1zEJKEBFodMdmrfSYSOcjwoGTmEc8PZl6wirYc1uj9cRONfisBMmBQWVCrc/gy4ncASyfNahR2Xo0fBJdjAgHgvqJyogW63PuaV0bLcZsoZYN+KlDyU/hfQ+1j1XWYFmBgMKk4vgTC2zTA9wT0dIzqD35U72FlsNZ+rxa38NvhcrZpFNZg33dUtNywt+Dm9HgcE5wH7eMsCeznuilAFdWoV2QS75nawPSN0BLVuqYNQgqNCP/QXejwYEzFc9wT0TNqFT6XGULFqwWvD5zaNnxoICvNSBjAJdKotRW6lIZNZFtepUzFowxNw6GJdMIXx6U1rgpqDQF8BlDy/eMl+G2nr8olRO+fyAY6Gej37DOOBM4bHhMuaS/0GKBFjyUUcQxYAkoMeBrEIkNyNIWp9zOBoNJqWSZ9XdjNDjcEvDPB4YWC7SyBTkp42Gl2mErb41umUzEBmfJbJXaL6kSI/ff43dOTqizkeCAAeqJV7fFaURukuFLDesT+O1OLYGbCvhSPyIFhlr5kVrmYjArHcia6CTmakYo4LAxMBxiasqVEcoW5KRM2aFblsv6kWUtA/Bf3163jy99DzUsfT9C3onS50102Ao4sKnpG4v6C6UywrsctdMhNgeXmKlaRpYRDDrzUfIo5NbVy4zVsv4eOPQPh9cA4Gl6DH5TU+7+BzUMlabH5SwlQ9Qhy1ZSYLAAfueD95qObftyQllD7eLeyX9nrkaCAxB4JBj8oanUEzyueFNQpiYSrSBqOUwVSxVNMexnLbkm1VCMZUota5D3YfLfmxfAYQIfQ8sOBv9kTgWcbzr6YItgaJlILAFDqlSxt9XKCX9zVsoEVYLKhKcwgcOMar07wnsTcv6G+P6Yei9pdrZ4GXxD1ENEn5uDnv/vidAxeJVWy81sfAIOnJXIBlIqSNUPiHsdIhiWnMtoAUOuVFG/oOXEZfzaKjNqq+r43QEOw5+ubAGDNQ5TzUPvVYilQgRD66gyHr/OgaFknrKfqZSh5C7D1fet+S1oRAKH4fsMtbpfGUOq3vcNwBiIjwVDyeSUMk/572+vl/oTyjZS/QQDTO20pr9PEwGHIVUL2BIYfAMwfp3HgMGbnFKf55fRpr6++h6l/kSu7yFo1EarZA3AYfpyIgcGNQBTzsF4HdxSMCjwUk/16JGI5ikFfu57CmgpMKiHUFsUQ9YAHIZXbWyphSvxKeodkbn3PRYMqeCN+xlj41OBn+sVlMCgQ1wtzlAmFGPDYfrlsrVRooI8dvpLYIg24qVg0NdO3XMZAzI2Pn35Uxp15gxbuQwJq/R2lsxytmIDTcjcE7gEhmhAajlZmfra8cmd6i/EtL/kVShBJ35uLZNK7YRAHLyaytOgdW0+0PTETIEhBs0Sg1N0KPrvWesv1MofP67Mwark26iVNQg4TNVrUDD5IKwZkXzKX3MUtoIhTgNyW6HiAtjU2Y/ajVgt5Q/lxDxwuKbXkO/Cp3YZ5LYt+aWqNW9Ai3U5tZwl9zNrKhIzobh+7rFg8P8PUFInO3ZIjn1+QhmAntA1I1J8mi5ZPqvv57OR1MGpXPDm+ggqRUrHwJeAgenEfDskr2b8RyytOUsZg0pjxdhnOHRkqQCOI9BScOvcgy9h/BHx3Io6/zGtP++k6+aX6PVocJjyUpuSuSdmDf6IdK05t2RrlC8HFKCx0Ve6SSvVo8gdEV9ixy5BCM11qc05jch81iBDUG6858uJpX0Gfa6Wy/pr6WojUN8Y1c8l0JT6C4eAIZY4aBI4zOiSLE0RlGor4JRF5ILNlxNLLtH1DsXUKrdS4Hpg2dfxxiitt69thmoFA36GiS/S3U24RzLnbbBA8FmDnsS5UsHX4EvKCcHAAjlelNtyIY0+3mDkb8UqeTZKB8Navhfazv7IY8PhjinF33sL9n6N7HJOQz/SaznqHbMTC7rUxqaS7yKWBLmFMqXNUEuapZy23KbH4dhwuJls3JR88avQSqchY9ZQO7kYG5AqGzwYSo3HeHRbP2dtE3TN5g0Y+vQ4HBsO03gdSkez9WSVASo37vRZQ2kkmjsGbU98D4YWi3UM1lJvIU5CAMNYY8xjw2GaiUVuAqDJQcv832cNj23sLQWDfY3SHsj4ObWSAy9Df5OKY8PhZPZtT/aUVc3/HFlDHFO2gkHBqhKiZY1d7XKdWgmCDtL1kHDYA+LVzM1ICygLPjX5alblxxqIWsDgzVdL79BYcg8GYHgSXY4Mh9uZm5FWw2ssWMoIVBq0Zg3yJBwKhtbLdUrLbekxHEVnI8PhamY4aKFLyS/g72ZonVCUtkK3uB9b+gXew7DkHgzA0Gczcg04nM8+qdCTN/ek9oHUkrLHVH0JGFodl4d6GABDv83Io8NhBht1DQ41a7WCsCXI496Dlubg0nMPvvRYeg9GqkGKtm+bXhMOQzslS0FdKxf8Aaslo8QlDsraacqnMDdhie7bGbkmHIY2Q5Xq8dqSFvUjLBhbT1suOZBV2hdR+lmWgIHTlX0veFkbDmczw6EU+JpStASvb0K2NAjlZGwpPbyHoWWK4cepgOFZdDsFHEY/oVk7jZk7WelvdarV9r4J2XKLlt9kvQQMSzwM8dYt1OdJzC3A4WY2OChAc+/3JqZaUCrDaPEneA9E632US8Dg3ZLo2XQ6ExwuZ4ODnqy5RqM/Gt2aNbT4IFonE4eAwZui0LPp1RoxuiYcTmaDg4I/9/RWD6HWb1DW0HJfhb5n7WseAgb6C2Oep1gdDiNbqXNwUPDXJhmlJ7zPGmrTidTG6KcCAzdRjWuZ3gocLmeDQ25SoWZlLeiVNdSakLWFtYeCIXXBLhqzpFgbDkOWFrlphAV2Lqi9Z6HF11DLGhTApSzE9zhawBDXzaGxS4pV4TBqaZEDQOl9LSWArMi1rKG2sDYe024BA8tZ5isptgCHi1luuSoFtoIv937vgShlDSonSndbLAEDZcSqul8zNleHw6iGqEPhkDvvoPfX9jsokHMA8ce0a2CgjJjT+LQ1OAx3A3dqXFmCg0qGXDNTjciWSUbperrW/Q2UEXNtmd4yHE5n2CFZgoOe+ClTk1/+knva1+6/8Gao0mlPyojN6GbtuNwEHEY8xp16euv2qaXlQEuDUU/6XGZRux9DEOJKunmPZ28ZDhejTyzsbYfAoTaWVLMy97VVbpRckix+pRG5WTjsBtxMnQryXEOxBIdaSaGsINVH0PSiNJng0NTcG6Z7gcNQjslY2yv1XwIHGZ9qI85cVqDr7FIuSbY14YjsBg6jjTVj3+EQOOhzclMMPfVTwa/PTTUg463biPFlD3AYZoVcLCGUBZT6CvF9GnGmPqeUNWjCkXsf/oVtrp7fwvhyy3A4GSl78H0ABXPqSZ6Dg6YHpbMRqazBsoKUS5Jj1myX7hYOo2UPsbTIlQgqDyIccuct5GtIZQYafcavxUSCrGEEOAyTPcTSwjKElF9B/QEf0CpDUgBQoMcJhaARoQQYyBqGgMNokwsfwAaB1DizBIdUppEzVBlIoksSMDChGAoOI/ke/JNfR7NjL0AB7OGQAobvXURTVOrtNB/xNYwKhyFck/5Jro1POT+Dtzfn4GAfk9ooZRDy/QnAgBtyWDiMdObCP80tgGOpoNGjf3vOF2GfH/sQyhoEEgxOnKGYAQ5D3I7ln+gW9Kl+QYRDaiFtbhxqsPBfkwtsucVqeDiMtO9BT3VlCbHvEHdM2utxjGkZSCwpYtbAzVPdjC5PgcPTjDZfjdSYtACPT/94ajN1itO+RiwpfNbgdz8gbNLDw2Gk5qTcjKkgt5LCZwUpOFh24fsX8jUoa6DPQBNyOjiMsqla5iTLGqLfQePMHBxUPni7tH2OPoZygo3SM8Ohe+ekH2saHLxBSiWBsgAL+uiRiECxTMEAoQyCwMMJOSUcRikvNJGwLCJ19kK9CINDHG1667UWubCwhXICOPwdEDcjZA/a2RibkgJChIOBwZuk7HWDi7/TAm16OnEGHJheNJuirCyIZy+UHUQ42N+9W1KfS9bAdAI4DGSOUsZgkPB9BQt+eRsMDB4O3hth2YL2QhJ4mJ2Aw/8HxFXv2YMF90e/8Nl/GE1qYpGCgy8pTFw+s/0Tl1vc0zA8HHrvPyh7sL5BPHthGYQFvrIKKx+iPZp7JugzAId6/+G+5+zBSgQf+AYFywoMEHq7f91e3vngvbcnORFHsYFD+Tq91z1nD5YhyNxkQW9/j3BQiWEZg2UbNCI3reve42oIOPTeoLTsQQHvSwvdWxnhYFkFi2JpQAKHCVbLKXv4zIdfezuNsJ6CdjJEOCirIAi3aXTquQE5LBx63lxt2YMFvBqT9qdlBx4O8ji8/72XTCnYIA0cZplgqHx49+WHb0eaVmbIEOXhYG/XIhjEZAI4TAAIa0h6CFj5YBmCf7u9zjZpwAAcHg+IrkacyhK++dMfvm08qtzw4mj25nQxbAwNDIfuPBAaaSpLiICwvzPCxMsAHCYFhE0vvv6THzyMN00GBfvTSgw2PQEG4ICLEgEG4HBEQNzyS42eoPl4MUPMTAOHURbFIKYSwAFAIMAAHLBaIyzRwGGLy2pf88uPSoeoZgXD1HBwpzlfEQRo1GPXwOHxk4w7ggG5/sLl7HEBHAa8sBc9eufjGfEAHOhDIPoLwGHx2jnKjLnKiCt+94HD8Itj0OIxJWUEcDh4msG5DC61BQ6ILIJsAQEHehH0FhBweAbrNRON/iYRp/z+AodjGacoNfooIc75nQUOa5UanPLcppkJlyNw2MxUg37ENvoKTCGAwyYhcQ4k1oMCDkfg0AskKDeOUz5cAQXg0HNPgunG0zca6SkAh2GmG1fsjni0bjAwAYcZSg6yifYsgdIBOEyXTVyyMj/bS7gmSwAO/CMACoAAHNCCpTPXE/QobvclA9Zm4IAOnHhc7vsU9517Ee72fgQszcABPVMJcr4PstuNAkMguN6DjVIBOKCVLdwXe2jc7IPz/ggAUDZwtYcWJQJwQB3C49zpah/UNV2Ez2OkCBwQQsABIYSAA0IIOCCEgANCCDgghIADQgg4IISAA0IIOCCEgANCCDgghIADQgg4IIQQcEAIAQeEEHBACAEHhBBwQAgBB4QQcEAIAQeEEHBACAEHhBBwQAjNpv8Dk0Q1kjQ/MS4AAAAASUVORK5CYII=",
      description:
        "Anne had developed depression and excessive fatigue from her pain medications, specifically the opioid analgesics, to the point that she was no longer an active woman. Most of her days were spent reclining in a chair at home to the point that her muscles became weak and her overall endurance declined. Beyond the resultant inactivity, opioid analgesics affect the body’s hormones and can further negatively affect muscle mass and strength.",
      organs: ["muscle", "knee_joint"],
      keyParts: "Muscles, Tissue",
      processes: [
        {
          category: "Muscle Function",
          items: [
            {
              name: "Muscle Contraction & Relaxation",
              desc: "Enables movement and support",
            },
            {
              name: "Muscle Glycogen Storage",
              desc: "Stores energy for physical activity",
            },
          ],
        },
        {
          category: "Connective Tissue",
          items: [
            {
              name: "Connective Tissue Health",
              desc: "Maintains and repairs connective tissues",
            },
          ],
        },
      ],
    },
    {
      id: "nervous",
      title: "Nervous",
      color: "#627d32",
      thumbnail:
        "data:image/png;base64,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",
      description:
        'The central nervous system, made up of the brain and spinal cord, is particularly vulnerable to the effects of opioid analgesics. For instance, opioid analgesics have been found to increase the likelihood of either developing depression or further worsening preexisting depression. Depression is often, unfortunately, accompanied by social isolation and sleep disturbances, either insomnia or excessive daytime sleepiness. One physician’s examination of Anne revealed that, "her speech was slurred and it was hard to keep her awake to carry on a conversation." Furthermore, opioid analgesics have the potential to over-sensitize the brain, leading to a condition where patients have actually had increased amounts of pain. This condition is called opioid-induced hyperalgesia. Finally, we cannot forget about the risks of dependence and addiction that frequently accompany opioid analgesic use.',
      organs: ["brain"],
      keyParts: "Brain, Spinal Cord, Nerves",
      processes: [
        {
          category: "Brain Function & Health",
          items: [
            {
              name: "Cognitive Function",
              desc: "Enables thinking, reasoning, memory and learning",
            },
            {
              name: "Memory Formation & Retrieval",
              desc: "Creates and recalls memories",
            },
            {
              name: "Neurotransmitter Regulation",
              desc: "Balances brain chemicals for mood, sleep, and focus",
            },
            {
              name: "Neural Plasticity",
              desc: "Allows brain adaptation to new experiences and recovery from injury",
            },
            {
              name: "Synaptic Plasticity",
              desc: "Strengthens or weakens neural connections for learning",
            },
          ],
        },
        {
          category: "Nerve Function",
          items: [
            {
              name: "Nerve Signal Transmission",
              desc: "Transmits signals throughout the body",
            },
            {
              name: "Myelin Formation",
              desc: "Creates protective nerve coatings for fast signal transmission",
            },
            {
              name: "Neurogenesis",
              desc: "Generates new neurons for learning and repair",
            },
          ],
        },
        {
          category: "Regulation Systems",
          items: [
            {
              name: "Sleep Regulation",
              desc: "Controls rest patterns essential for repair and memory",
            },
            {
              name: "Circadian Rhythms",
              desc: "Maintains internal 24-hour body clock",
            },
            {
              name: "Autonomic Nervous System Regulation",
              desc: "Controls involuntary functions like heart rate and digestion",
            },
            {
              name: "Stress Response Management",
              desc: "Balances stress hormones through the HPA axis",
            },
            {
              name: "Neuroendocrine Regulation",
              desc: "Coordinates nervous and hormonal systems",
            },
          ],
        },
      ],
    },
    {
      id: "reproductive",
      title: "Reproductive",
      color: "#005e9d",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "Due to the effects that opioid analgesics can have on the endocrine system and the body’s hormones, both men and women are at increased risk for reproductive system abnormalities. Women, for instance, are more prone to menstrual irregularities and carry a two-times higher risk of having children with birth defects. Men and women are both at higher risk for sexual dysfunction and problems with intimacy.",
      organs: ["male_reproductive", "female_reproductive"],
      keyParts:
        "Male: Penis, Testicles, Prostate, Sperm | Female: Vagina, Ovaries, Uterus, Eggs, Breasts, Mammary Glands",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Fertility & Reproduction",
              desc: "Enables offspring production",
            },
            { name: "Spermatogenesis", desc: "Produces sperm in males" },
            { name: "Oogenesis", desc: "Develops eggs in females" },
            {
              name: "Menstrual Cycle Regulation",
              desc: "Regulates female reproductive cycle",
            },
            {
              name: "Lactation",
              desc: "Produces milk for infant nutrition",
            },
          ],
        },
      ],
    },
    {
      id: "respiratory",
      title: "Respiratory",
      color: "#422c88",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "Due to the number of opioid analgesics and potentially deadly combination of muscle relaxants and opioid analgesics, Anne was at a high risk of overdose and respiratory depression. Opioid analgesics decrease the brain’s ability to sense high levels of carbon dioxide in the blood and also diminish the amount of air breathed in by the lungs. This is the most common way that people die from opioid overdose — their breathing slows down, their breathing stops and they ultimately suffocate.",
      organs: ["lungs_left", "lungs_right", "larynx_trachea"],
      keyParts: "Lungs, Bronchi, Trachea",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Respiratory Gas Exchange",
              desc: "Exchanges oxygen and carbon dioxide between blood and lungs",
            },
            {
              name: "Lung Capacity & Efficiency",
              desc: "Enables efficient lung expansion and contraction",
            },
            {
              name: "Tissue Oxygenation",
              desc: "Delivers oxygen to all body tissues",
            },
            {
              name: "Prostaglandin Synthesis",
              desc: "Produces compounds for inflammation and tissue regulation",
            },
          ],
        },
      ],
    },
    {
      id: "skeletal",
      title: "Skeletal",
      color: "#90bc53",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "The body’s skeletal system is in an almost constant state of turnover. That is, older bone tissue is broken down and stronger bone tissue is formed, resulting in stronger bones. Opioid analgesics have been found not only to impair this process by having a direct effect on bone-generating cells, called osteoblasts, but also negatively affect the hormones of the body that help regulate bone growth. Anne’s cognition was significantly impaired by her medications, causing her to fall multiple times. While she did not directly sustain any fractures, she was at a much higher risk for bone injury as a result of the opioid analgesics being taken.",
      organs: ["knee_joint"],
      keyParts: "Bones, Joints",
      processes: [
        {
          category: "Bone Health",
          items: [
            {
              name: "Bone Remodeling",
              desc: "Continuously forms and resorbs bone tissue",
            },
            {
              name: "Calcium Homeostasis",
              desc: "Maintains calcium levels for bone strength",
            },
          ],
        },
        {
          category: "Joint Health",
          items: [
            {
              name: "Joint Lubrication",
              desc: "Produces fluid for smooth movement",
            },
            {
              name: "Synovial Fluid Production",
              desc: "Lubricates and nourishes cartilage and bones",
            },
          ],
        },
      ],
    },
    {
      id: "urinary",
      title: "Urinary",
      color: "#e87722",
      thumbnail:
        "data:image/png;base64,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",
      description:
        "The ability to void or urinate can be affected by opioid analgesics as it was in Anne’s case. She had developed a condition called urinary retention or failure to completely empty her bladder. Opioid analgesics can decrease the sensation of a full bladder by limiting the amount of discomfort that is noticed. They can also cause increased resistance to urine flow out of the bladder. Both situations, as well as more complicated spinal cord involvement, can result in urinary retention that, when left untreated for long periods of time, can contribute to urinary tract infections and kidney damage.",
      organs: ["kidneys", "bladder"],
      keyParts: "Kidneys, Bladder, Ureters, Urethra",
      processes: [
        {
          category: null,
          items: [
            {
              name: "Proper Kidney Function",
              desc: "Filters waste and regulates fluids",
            },
            {
              name: "Micturition (Urination)",
              desc: "Expels urine from the bladder",
            },
            {
              name: "Waste Product Elimination",
              desc: "Removes waste through urine",
            },
            {
              name: "Electrolyte Balance",
              desc: "Regulates important minerals",
            },
            {
              name: "Fluid Balance",
              desc: "Maintains correct water volume",
            },
          ],
        },
      ],
    },
    {
      id: "other",
      title: "Other",
      color: "#888888",
      thumbnail: null,
      description:
        "These processes span across all body systems or involve multiple systems working together. They are essential for maintaining overall health and homeostasis.",
      organs: [],
      keyParts: null,
      processes: [
        {
          category: "Cellular & Molecular Processes",
          categoryDesc: "These processes occur throughout all body systems",
          items: [
            {
              name: "Cellular Respiration",
              desc: "Produces energy from glucose and oxygen",
            },
            {
              name: "Protein Synthesis",
              desc: "Creates proteins for growth and repair",
            },
            {
              name: "DNA Repair & Maintenance",
              desc: "Corrects DNA damage",
            },
            {
              name: "Methylation",
              desc: "Supports DNA repair and immune regulation",
            },
            {
              name: "Autophagy",
              desc: "Degrades and recycles cellular components",
            },
            {
              name: "Cell Division",
              desc: "Enables growth, repair, and reproduction",
            },
            {
              name: "Antioxidant Defense",
              desc: "Combats free radical damage",
            },
            {
              name: "Sodium-Potassium Pump Activity",
              desc: "Maintains cell function and volume",
            },
            {
              name: "Oxidative Phosphorylation",
              desc: "Produces cellular energy (ATP)",
            },
            {
              name: "Nucleotide Synthesis",
              desc: "Creates DNA and RNA building blocks",
            },
            {
              name: "Enzyme Regulation",
              desc: "Controls chemical processes in the body",
            },
          ],
        },
        {
          category: "Cross-System Processes",
          categoryDesc:
            "These processes involve multiple systems working together",
          items: [
            {
              name: "pH Balance",
              desc: "Maintains acid-base levels in body fluids",
            },
            {
              name: "Hydration",
              desc: "Sustains proper fluid balance",
            },
            {
              name: "Ion Homeostasis",
              desc: "Regulates sodium, potassium, and calcium levels",
            },
            {
              name: "Vitamin & Mineral Utilization",
              desc: "Absorbs and uses essential nutrients",
            },
            {
              name: "Body Composition Regulation",
              desc: "Balances muscle, fat, and bone",
            },
            {
              name: "Lipid Metabolism",
              desc: "Breaks down or synthesizes fats",
            },
            {
              name: "Lipoprotein Metabolism",
              desc: "Transports fats and cholesterol",
            },
            {
              name: "Capillary Exchange",
              desc: "Transfers substances between blood and tissues",
            },
            {
              name: "Mucosal Barrier Integrity",
              desc: "Maintains protective mucous membranes",
            },
            {
              name: "Cholesterol Metabolism",
              desc: "Manages cholesterol production and use",
            },
          ],
        },
      ],
    },
  ];

  const ORGAN_TO_SYSTEM = {};
  BODY_SYSTEMS.forEach((sys) => {
    sys.organs.forEach((organId) => {
      if (!ORGAN_TO_SYSTEM[organId]) ORGAN_TO_SYSTEM[organId] = [];
      ORGAN_TO_SYSTEM[organId].push(sys.id);
    });
  });
  let activeSystem = null;

  // --- System-to-body-parts mapping ---
  const SYSTEM_TO_BODY_PARTS = {
    cardiovascular: ["bp_heart", "bp_blood_vessels", "bp_blood"],
    digestive: [
      "bp_stomach",
      "bp_intestines",
      "bp_colon",
      "bp_rectum",
      "bp_anus",
      "bp_liver",
      "bp_gallbladder",
      "bp_pancreas",
    ],
    endocrine: [
      "bp_pancreas",
      "bp_thyroid",
      "bp_parathyroid",
      "bp_adrenal",
      "bp_pituitary",
      "bp_salivary_glands",
      "bp_mammary",
    ],
    immune: [
      "bp_lymphnode",
      "bp_spleen",
      "bp_appendix",
      "bp_white_blood_cells",
    ],
    integumentary: ["bp_skin", "bp_hair"],
    muscular: ["bp_muscles", "bp_tendons", "bp_skin"],
    nervous: ["bp_brain", "bp_nerves", "bp_spine"],
    reproductive: null,
    respiratory: ["bp_lungs"],
    skeletal: ["bp_bones", "bp_joints"],
    urinary: ["bp_kidneys", "bp_bladder", "bp_urinary_tract", "bp_urethra"],
  };

  const REPRODUCTIVE_BODY_PARTS = {
    female: [
      "bp_vagina",
      "bp_vulva",
      "bp_uterus",
      "bp_fallopian_tubes",
      "bp_ovaries",
      "bp_breasts",
    ],
    male: ["bp_penis", "bp_testicles", "bp_prostate"],
  };

  function getBodyPartsForSystem(systemId) {
    if (systemId === "reproductive") {
      return REPRODUCTIVE_BODY_PARTS[currentGender] || [];
    }
    return SYSTEM_TO_BODY_PARTS[systemId] || [];
  }

  // --- Render systems sidebar ---
  function renderSystemsSidebar() {
    const list = document.getElementById("systemsList");
    BODY_SYSTEMS.forEach(function (sys) {
      const li = document.createElement("li");
      li.id = "system-" + sys.id;
      li.setAttribute("data-system", sys.id);

      const a = document.createElement("a");

      const dot = document.createElement("span");
      dot.className = "system-dot";
      dot.style.backgroundColor = sys.color;
      a.appendChild(dot);

      if (sys.thumbnail) {
        const thumb = document.createElement("img");
        thumb.className = "system-thumb";
        thumb.src = sys.thumbnail;
        thumb.alt = sys.title;
        a.appendChild(thumb);
      }

      const text = document.createTextNode(sys.title);
      a.appendChild(text);

      a.addEventListener("click", function () {
        selectSystem(sys.id);
      });

      li.appendChild(a);
      list.appendChild(li);
    });
  }

  // --- Show tooltip panel ---
  function showTooltip(systemId) {
    const sys = BODY_SYSTEMS.find(function (s) {
      return s.id === systemId;
    });
    if (!sys) return;

    document.getElementById("tooltipEmpty").style.display = "none";
    const content = document.getElementById("tooltipContent");
    content.classList.add("visible");

    document.getElementById("tooltipTitle").textContent = sys.title;
    document.getElementById("tooltipDesc").textContent = sys.description;
    if (sys.thumbnail) {
      document.getElementById("tooltipThumb").src = sys.thumbnail;
      document.getElementById("tooltipThumb").alt = sys.title;
      document.getElementById("tooltipThumb").style.display = "";
    } else {
      document.getElementById("tooltipThumb").style.display = "none";
    }
    document.getElementById("tooltipSystemBar").style.backgroundColor =
      sys.color;

    const SYSTEM_IMAGE_MAP = {
      cardiovascular: "bodyimage/cardiovascular_system.png",
      digestive: "bodyimage/digestive_system.png",
      endocrine: "bodyimage/endocrine_system.png",
      immune: "bodyimage/immune_lymphatic_systems.png",
      integumentary: "bodyimage/integumentary_system.png",
      muscular: "bodyimage/muscular_system.png",
      nervous: "bodyimage/nervous_system.png",
      reproductive:
        currentGender === "female"
          ? "bodyimage/female_reproductive_system.png"
          : "bodyimage/male_reproductive_system.png",
      respiratory: "bodyimage/respiratory_system.png",
      skeletal: "bodyimage/skeletal_system.png",
      urinary: "bodyimage/urinary_system.png",
    };
    const sysImg = document.getElementById("tooltipSystemImage");
    const imgSrc = SYSTEM_IMAGE_MAP[sys.id];
    if (imgSrc) {
      sysImg.src = imgSrc;
      sysImg.alt = sys.title;
      sysImg.style.display = "";
    } else {
      sysImg.style.display = "none";
    }

    // Render Body Processes section
    var processesEl = document.getElementById("tooltipProcesses");
    if (sys.processes && sys.processes.length > 0) {
      // Clear previous content
      processesEl.textContent = "";

      // Divider
      var divider = document.createElement("div");
      divider.className = "tooltip-processes-divider";
      processesEl.appendChild(divider);

      // Title
      var title = document.createElement("h4");
      title.className = "tooltip-processes-title";
      title.textContent = "Body Processes";
      processesEl.appendChild(title);

      // Key parts
      if (sys.keyParts) {
        var keyPartsP = document.createElement("p");
        keyPartsP.className = "tooltip-processes-key-parts";
        var strong = document.createElement("strong");
        strong.textContent = "Key Parts: ";
        keyPartsP.appendChild(strong);
        keyPartsP.appendChild(document.createTextNode(sys.keyParts));
        processesEl.appendChild(keyPartsP);
      }

      // Process groups
      sys.processes.forEach(function (group) {
        if (group.category) {
          var catDiv = document.createElement("div");
          catDiv.className = "tooltip-processes-category";
          catDiv.textContent = group.category;
          processesEl.appendChild(catDiv);
        }
        if (group.categoryDesc) {
          var catDescP = document.createElement("p");
          catDescP.className = "tooltip-processes-category-desc";
          catDescP.textContent = group.categoryDesc;
          processesEl.appendChild(catDescP);
        }
        var ul = document.createElement("ul");
        ul.className = "tooltip-processes-list";
        ul.style.setProperty("--system-color", sys.color);
        group.items.forEach(function (item) {
          var li = document.createElement("li");
          var nameSpan = document.createElement("span");
          nameSpan.className = "process-name";
          nameSpan.textContent = item.name;
          var descSpan = document.createElement("span");
          descSpan.className = "process-desc";
          descSpan.textContent = " \u2014 " + item.desc;
          li.appendChild(nameSpan);
          li.appendChild(descSpan);
          ul.appendChild(li);
        });
        processesEl.appendChild(ul);
      });

      processesEl.classList.add("visible");
    } else {
      processesEl.textContent = "";
      processesEl.classList.remove("visible");
    }
  }

  // --- Hide tooltip panel ---
  function hideTooltip() {
    document.getElementById("tooltipEmpty").style.display = "";
    const content = document.getElementById("tooltipContent");
    content.classList.remove("visible");
    document.getElementById("tooltipSystemBar").style.backgroundColor = "";
    const sysImg = document.getElementById("tooltipSystemImage");
    sysImg.style.display = "none";
    sysImg.src = "";
    var processesEl = document.getElementById("tooltipProcesses");
    processesEl.textContent = "";
    processesEl.classList.remove("visible");
  }

  // --- Select a body system ---
  function selectSystem(systemId) {
    // Toggle: if same system clicked, deselect
    if (activeSystem === systemId) {
      deselectSystem();
      return;
    }

    // Deselect previous system organs if any
    if (activeSystem) {
      const prevSys = BODY_SYSTEMS.find(function (s) {
        return s.id === activeSystem;
      });
      if (prevSys) {
        prevSys.organs.forEach(function (organId) {
          selectedOrgans.delete(organId);
          const g = document.getElementById("group-" + organId);
          if (g) g.classList.remove("selected");
        });
      }
      // Clear previous system's auto-added body parts
      systemSelectedBodyParts.forEach(function (bpId) {
        selectedBodyParts.delete(bpId);
        // Remove section ellipses
        var bpLayer = document.getElementById("bp-highlight-layer");
        if (bpLayer) {
          bpLayer
            .querySelectorAll('[data-bp-id="' + bpId + '"]')
            .forEach(function (el) {
              el.remove();
            });
        }
        // Clean up organ highlights for removed body parts
        var bp = BODY_PARTS_DATA.find(function (b) {
          return b.id === bpId;
        });
        if (bp && bp.organIds) {
          bp.organIds.forEach(function (organId) {
            var keptByOther = [...selectedBodyParts].some(function (otherId) {
              var other = BODY_PARTS_DATA.find(function (b) {
                return b.id === otherId;
              });
              return other && other.organIds.includes(organId);
            });
            if (!keptByOther) {
              selectedOrgans.delete(organId);
              var group = document.getElementById("group-" + organId);
              if (group) group.classList.remove("selected");
              document
                .querySelectorAll('[data-part="' + organId + '"]')
                .forEach(function (el) {
                  el.classList.remove("selected");
                });
            }
          });
        }
      });
      systemSelectedBodyParts.clear();
    }

    activeSystem = systemId;

    // Highlight all mapped SVG organs
    const sys = BODY_SYSTEMS.find(function (s) {
      return s.id === systemId;
    });
    if (sys) {
      sys.organs.forEach(function (organId) {
        if (organId === "male_reproductive" && currentGender !== "male") return;
        if (organId === "female_reproductive" && currentGender !== "female")
          return;

        selectedOrgans.add(organId);
        const g = document.getElementById("group-" + organId);
        if (g) g.classList.add("selected");
      });
    }

    // Auto-select body parts for this system
    systemSelectedBodyParts.clear();
    var bpIds = getBodyPartsForSystem(systemId);
    bpIds.forEach(function (bpId) {
      if (!selectedBodyParts.has(bpId)) {
        systemSelectedBodyParts.add(bpId);
      }
      selectedBodyParts.add(bpId);

      // Highlight SVG organs for each body part
      var bp = BODY_PARTS_DATA.find(function (b) {
        return b.id === bpId;
      });
      if (bp && bp.organIds) {
        bp.organIds.forEach(function (organId) {
          selectedOrgans.add(organId);
          var group = document.getElementById("group-" + organId);
          if (group) group.classList.add("selected");
          document
            .querySelectorAll('[data-part="' + organId + '"]')
            .forEach(function (el) {
              el.classList.add("selected");
            });
        });
      }
    });

    // Handle sections view: add ellipse highlights
    if (currentView === "sections") {
      var bpLayer = document.getElementById("bp-highlight-layer");
      if (bpLayer) {
        bpIds.forEach(function (bpId) {
          var regionData = BODY_PART_HIGHLIGHT_REGIONS[bpId];
          if (!regionData) return;
          bpLayer
            .querySelectorAll('[data-bp-id="' + bpId + '"]')
            .forEach(function (el) {
              el.remove();
            });
          var regions = Array.isArray(regionData) ? regionData : [regionData];
          regions.forEach(function (r) {
            var ellipse = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "ellipse",
            );
            ellipse.setAttribute("cx", r.cx);
            ellipse.setAttribute("cy", r.cy);
            ellipse.setAttribute("rx", r.rx);
            ellipse.setAttribute("ry", r.ry);
            ellipse.setAttribute("class", "bp-highlight-ellipse");
            ellipse.setAttribute("data-bp-id", bpId);
            makeEllipseClickable(ellipse, bpId);
            bpLayer.appendChild(ellipse);
          });
        });
        updateSectionHitAreaState();
      }
    }

    // Update sidebar active class
    document.querySelectorAll(".systems-list li").forEach(function (li) {
      li.classList.remove("active");
    });
    const activeLi = document.getElementById("system-" + systemId);
    if (activeLi) activeLi.classList.add("active");

    showTooltip(systemId);
    renderBodyPartsNavPanel();
    renderBodyPartCards();
    renderSelectedList();
  }

  // --- Deselect current system ---
  function deselectSystem() {
    if (activeSystem) {
      const sys = BODY_SYSTEMS.find(function (s) {
        return s.id === activeSystem;
      });
      if (sys) {
        sys.organs.forEach(function (organId) {
          selectedOrgans.delete(organId);
          const g = document.getElementById("group-" + organId);
          if (g) g.classList.remove("selected");
        });
      }
    }

    // Remove system-added body parts
    var bpLayer = document.getElementById("bp-highlight-layer");
    systemSelectedBodyParts.forEach(function (bpId) {
      selectedBodyParts.delete(bpId);
      // Remove section ellipses
      if (bpLayer) {
        bpLayer
          .querySelectorAll('[data-bp-id="' + bpId + '"]')
          .forEach(function (el) {
            el.remove();
          });
      }
      // Clean up organ highlights for removed body parts
      var bp = BODY_PARTS_DATA.find(function (b) {
        return b.id === bpId;
      });
      if (bp && bp.organIds) {
        bp.organIds.forEach(function (organId) {
          var keptByOther = [...selectedBodyParts].some(function (otherId) {
            var other = BODY_PARTS_DATA.find(function (b) {
              return b.id === otherId;
            });
            return other && other.organIds.includes(organId);
          });
          if (!keptByOther) {
            selectedOrgans.delete(organId);
            var group = document.getElementById("group-" + organId);
            if (group) group.classList.remove("selected");
            document
              .querySelectorAll('[data-part="' + organId + '"]')
              .forEach(function (g) {
                g.classList.remove("selected");
              });
          }
        });
      }
    });
    systemSelectedBodyParts.clear();

    activeSystem = null;

    document.querySelectorAll(".systems-list li").forEach(function (li) {
      li.classList.remove("active");
    });

    hideTooltip();
    if (currentView === "sections") updateSectionHitAreaState();
    renderBodyPartsNavPanel();
    renderBodyPartCards();
    renderSelectedList();
  }

  function clearActiveSystemUI() {
    if (!activeSystem) return;
    activeSystem = null;
    systemSelectedBodyParts.clear();
    document.querySelectorAll(".systems-list li").forEach(function (li) {
      li.classList.remove("active");
    });
    hideTooltip();
  }

  // --- Bridge: organ click updates system ---
  function updateSystemFromOrgan(organId) {
    const systems = ORGAN_TO_SYSTEM[organId];
    if (!systems || systems.length === 0) return;

    if (!selectedOrgans.has(organId)) {
      // Organ was deselected - check if any organs from active system remain
      if (activeSystem && systems.indexOf(activeSystem) !== -1) {
        const sys = BODY_SYSTEMS.find(function (s) {
          return s.id === activeSystem;
        });
        if (sys) {
          const anyRemain = sys.organs.some(function (oid) {
            return selectedOrgans.has(oid);
          });
          if (!anyRemain) {
            // Remove active class but don't deselect other organs
            activeSystem = null;
            document
              .querySelectorAll(".systems-list li")
              .forEach(function (li) {
                li.classList.remove("active");
              });
            hideTooltip();
          }
        }
      }
    } else {
      // Organ was selected - activate first matching system
      const newSystemId = systems[0];
      if (activeSystem !== newSystemId) {
        activeSystem = newSystemId;
        document.querySelectorAll(".systems-list li").forEach(function (li) {
          li.classList.remove("active");
        });
        const activeLi = document.getElementById("system-" + newSystemId);
        if (activeLi) activeLi.classList.add("active");
        showTooltip(newSystemId);
      }
    }
  }

  // === ORGAN VIEW STATE ===
  const ORGAN_SORT_ORDER = [
    "brain",
    "thyroid",
    "larynx_trachea",
    "thymus",
    "lungs_right",
    "lungs_left",
    "heart",
    "liver",
    "stomach",
    "gallbladder",
    "spleen",
    "pancreas",
    "kidneys",
    "intestines",
    "bladder",
    "male_reproductive",
    "female_reproductive",
    "muscle",
    "knee_joint",
  ];

  // === SECTION VIEW STATE ===
  const SECTION_SORT_ORDER = [
    "head_neck",
    "upper_body",
    "midsection_lower_torso",
    "upper_extremities",
    "lower_extremities",
    "back_head",
    "back_upper_back",
    "back_middle_lower_back",
    "back_upper_extremities",
    "back_lower_extremities",
  ];

  const SECTION_SYMPTOMS = {
    head_neck: [
      "Headache",
      "Dizziness",
      "Sore throat",
      "Neck stiffness",
      "Sinus pain or pressure",
      "Face pain",
      "Blurred vision",
      "Earache",
      "Jaw pain",
      "Swollen lymph nodes",
    ],
    upper_body: [
      "Chest pain",
      "Shortness of breath",
      "Cough",
      "Heart palpitations",
      "Upper back pain",
      "Rib pain",
      "Difficulty breathing",
      "Chest tightness",
      "Wheezing",
      "Shoulder pain",
    ],
    midsection_lower_torso: [
      "Abdominal pain",
      "Nausea",
      "Bloating",
      "Constipation",
      "Diarrhea",
      "Heartburn",
      "Loss of appetite",
      "Cramping",
      "Lower back pain",
      "Pelvic pain",
    ],
    upper_extremities: [
      "Arm pain",
      "Numbness in hands",
      "Tingling in fingers",
      "Elbow pain",
      "Wrist pain",
      "Swollen joints",
      "Muscle weakness",
      "Stiffness",
      "Shoulder pain",
      "Grip weakness",
    ],
    lower_extremities: [
      "Knee pain",
      "Leg cramps",
      "Ankle swelling",
      "Hip pain",
      "Numbness in feet",
      "Shin pain",
      "Varicose veins",
      "Muscle soreness",
      "Joint stiffness",
      "Difficulty walking",
    ],
    back_head: [
      "Headache",
      "Neck pain",
      "Stiff neck",
      "Tension headache",
      "Occipital neuralgia",
      "Scalp tenderness",
      "Neck cracking",
      "Limited neck movement",
      "Migraine",
      "Dizziness",
    ],
    back_upper_back: [
      "Upper back pain",
      "Shoulder blade pain",
      "Muscle tension",
      "Thoracic spine pain",
      "Postural pain",
      "Stiffness between shoulders",
      "Radiating pain",
      "Muscle spasm",
      "Burning sensation",
      "Limited mobility",
    ],
    back_middle_lower_back: [
      "Lower back pain",
      "Sciatica",
      "Muscle spasm",
      "Stiffness",
      "Herniated disc pain",
      "Tailbone pain",
      "Hip pain",
      "Radiating leg pain",
      "Numbness",
      "Difficulty bending",
      "Back pain",
      "Back pain that comes and goes",
      "Sudden back pain",
      "Severe back pain",
      "Lower back pain spreading to the groin",
      "Back pain decreases during rest",
      "Lower back pain spreading to the back of the thigh or knee",
      "Paraspinal muscle tenderness",
      "Difficulty bending down",
      "Stiff spine in the morning",
      "Back injury",
    ],
    back_upper_extremities: [
      "Arm pain",
      "Numbness",
      "Tingling",
      "Elbow pain",
      "Wrist pain",
      "Shoulder pain",
      "Muscle weakness",
      "Swelling",
      "Joint stiffness",
      "Reduced range of motion",
    ],
    back_lower_extremities: [
      "Leg pain",
      "Calf cramps",
      "Knee pain",
      "Hamstring tightness",
      "Achilles pain",
      "Hip pain",
      "Sciatica",
      "Numbness",
      "Swelling",
      "Muscle soreness",
    ],
  };

  // === ORGAN2 SYMPTOMS DATA ===
  // Maps body part keys to their symptom lists for the Organs2 tab
  const ORGAN2_SYMPTOMS = {
    head: [
      "Headache",
      "Face pain",
      "Sinus pain or pressure",
      "Fever",
      "Swollen face",
      "Face tingling or numbness",
      "Loss of consciousness",
      "Problems with memory",
      "Dizzy",
      "Feeling sick or queasy",
      "Hair loss",
      "Skin changes on the face",
      "Recent head or face area injury",
      "Facial muscle weakness",
    ],
    ears: [
      "Earache",
      "Decreased hearing",
      "Discharge from ear",
      "Clogged ear",
      "Itching in the ear",
      "Ringing in ears",
      "Ear injury",
    ],
    eyes: [
      "Eye pain",
      "Red eye",
      "Red and stinging eyes",
      "Itchy eye",
      "Watery eyes",
      "Yellow eyes",
      "Pain around behind the eye",
      "Visual impairment",
      "Double vision",
      "Temporary vision loss",
      "Different sizes of both pupils",
      "Skin changes on eyelid",
      "Drooping eyelids",
      "Dry discharge on eyelids",
      "Eye flashes",
      "Eyes sensitive to light",
    ],
    nose: [
      "Painful nose",
      "Swollen nose",
      "Runny nose",
      "Blocked nose",
      "Itchy nose or throat",
      "Nasal voice",
      "Snoring",
      "Sneezing",
      "Inability to smell properly",
      "Sinus pain or pressure",
      "Bleeding from nose",
      "Mucus dripping at the back of the throat",
      "Nose injury",
    ],
    oral_cavity: [
      "Changes in the mouth",
      "Bad breath",
      "Dryness in the mouth",
      "Toothache",
      "Difficulty biting or chewing",
      "Gum pain",
      "Swollen gums",
      "Bleeding gums",
      "Unusually red tongue",
      "Burning sensation on tongue",
      "Cough",
      "Snoring",
      "Vomiting",
      "Coughing up blood",
      "White spots on tonsils",
      "Lip injury",
      "Feeling sick or queasy",
      "Red throat",
      "Sore throat",
      "Painful swallowing",
    ],
    neck_throat: [
      "Sore throat",
      "Painful swallowing",
      "Difficult swallowing",
      "Red throat",
      "Cough",
      "Clearing the throat",
      "Whistling sound made while breathing",
      "Mucus dripping at the back of the throat",
      "Hoarse voice",
      "Itchy nose or throat",
      "Shortness of breath",
      "Pain in the neck",
      "Swollen neck",
      "Stiff neck",
      "Swollen neck veins",
      "Neck injury",
      "Enlarged lymph glands in the neck",
      "Whiplash injury",
    ],
    chest: [
      "Chest pain",
      "Chest pain spreading to the left upper limb",
      "Pressing chest pain",
      "Heartburn",
      "Palpitations",
      "Fast heart rate",
      "Slow heart rate",
      "Cough",
      "Shortness of breath",
      "Shallow breathing",
      "Rapid breathing",
      "Whistling sound made while breathing",
      "Chest injury",
    ],
    breasts: [
      "Pain or tenderness in both breasts",
      "Pain or tenderness in only one breast",
      "Enlarged breasts",
      "Lump in the breast",
      "Milky discharge from the nipple outside of breastfeeding period",
      "Leaking from the nipple discharge that is not milk",
      "Ulcer on the nipple",
      "Change in the nipple",
      "Wrinkling or dimpling of skin on breast",
    ],
    upper_abdomen: [
      "Stomach pain",
      "Upper central abdominal pain",
      "Upper left side abdominal pain",
      "Upper right side abdominal pain",
      "Burning or gnawing abdominal pain",
      "Colic abdominal pain",
      "Crampy abdominal pain",
      "Sharp or stabbing abdominal pain",
      "Pain when pressing the belly",
      "Heartburn",
      "Mass or lump in stomach",
      "Increased abdominal size",
      "Bloating",
      "Vomiting",
      "Feeling sick or queasy",
      "Indigestion",
      "Throwing up something that looks like blood or coffee grounds",
      "Recent abdominal injury",
    ],
    middle_abdomen: [
      "Abdominal cramps before period",
      "Stomach pain",
      "Central abdominal pain",
      "Burning or gnawing abdominal pain",
      "Colic abdominal pain",
      "Crampy abdominal pain",
      "Sharp or stabbing abdominal pain",
      "Pain when pressing the belly",
      "Mass or lump in stomach",
      "Increased abdominal size",
      "Bloating",
      "Constipation",
      "Diarrhea",
      "Vomiting",
      "Feeling sick or queasy",
      "Black stool",
      "Red stool",
      "Recent abdominal injury",
    ],
    lower_abdomen: [
      "Abdominal cramps before period",
      "Stomach pain",
      "Lower left side abdominal pain",
      "Colic abdominal pain",
      "Crampy abdominal pain",
      "Lower right side abdominal pain",
      "Lower abdominal pain",
      "Sharp or stabbing abdominal pain",
      "Pain when pressing the belly",
      "Bloating",
      "Increased abdominal size",
      "Mass or lump in stomach",
      "Accidental stool leakage",
      "Constipation",
      "Diarrhea",
      "Black stool",
      "Red stool",
      "Recent abdominal injury",
    ],
    abdomen: [
      "Stomach pain",
      "Upper central abdominal pain",
      "Upper left side abdominal pain",
      "Upper right side abdominal pain",
      "Burning or gnawing abdominal pain",
      "Colic abdominal pain",
      "Crampy abdominal pain",
      "Sharp or stabbing abdominal pain",
      "Pain when pressing the belly",
      "Heartburn",
      "Mass or lump in stomach",
      "Increased abdominal size",
      "Bloating",
      "Vomiting",
      "Feeling sick or queasy",
      "Indigestion",
      "Throwing up something that looks like blood or coffee grounds",
      "Recent abdominal injury",
      "Abdominal cramps before period",
      "Central abdominal pain",
      "Constipation",
      "Diarrhea",
      "Black stool",
      "Red stool",
      "Lower left side abdominal pain",
      "Lower right side abdominal pain",
      "Lower abdominal pain",
      "Accidental stool leakage",
    ],
    sexual_organs_female: [
      "Abnormal vaginal discharge",
      "Vaginal bleeding after sex",
      "Painful sex",
      "Reddened vulva",
      "Urinating often",
      "Pain when urinating",
      "Dark urine",
      "Red urine",
      "Leaking urine by accident",
      "Urinating often at night",
      "Pain in groin or genital area",
      "Itching in crotch",
      "Urgent need to urinate",
      "Peeing small amounts at a time",
      "Skin changes on or around genitals",
    ],
    sexual_organs_male: [],
    back: [
      "Excessive hair",
      "Back pain",
      "Back pain that comes and goes",
      "Sudden back pain",
      "Severe back pain",
      "Middle or upper back pain",
      "Back pain decreases during rest",
      "Stiff spine in the morning",
      "Spine asymmetry",
      "Difficulty bending down",
      "Back injury",
    ],
    lower_back: [
      "Back pain",
      "Lower back pain",
      "Back pain that comes and goes",
      "Sudden back pain",
      "Severe back pain",
      "Lower back pain spreading to the groin",
      "Back pain decreases during rest",
      "Lower back pain spreading to the back of the thigh or knee",
      "Paraspinal muscle tenderness",
      "Difficulty bending down",
      "Stiff spine in the morning",
      "Back injury",
    ],
    buttocks: [
      "Butt pain",
      "Hip pain",
      "Pain when moving hip",
      "Pain in lower limb",
      "Pain in both lower limbs",
      "Acute thigh or buttock pain appearing during exertion and relieving after short rest",
      "Lower back pain spreading to the back of the thigh or knee",
      "Anorectal pain",
      "Hip swelling",
      "Bleeding from anus",
      "Ulcer, sore, or abscess near the anus",
      "Itchy anus",
      "Red stool",
      "Black stool",
    ],
    anus: [
      "Anorectal pain",
      "Buttocks pain",
      "Pain when passing stool",
      "Itchy anus",
      "Ulcer, sore, or abscess near the anus",
      "Red stool",
      "Bleeding from anus",
      "Black stool",
      "Foul-smelling stools",
      "Diarrhea",
      "Diarrhea with more than 6 bowel movements per day",
      "Constipation",
      "Accidental stool leakage",
      "Worms in stool",
    ],
    upper_arm: [
      "Pain in upper limb",
      "Severe pain in upper limb",
      "Shoulder pain",
      "Pain when moving shoulder",
      "Joint hard to move",
      "Pain in both upper limbs",
      "Swelling of the upper limb",
      "Swollen shoulder",
      "Tingling or numbness of one upper limb",
      "Tingling or numbness of both upper limbs",
      "Loss of feeling in both arms",
      "Spasms in arms or hands",
      "Arm injury",
      "Limb weakness",
    ],
    elbow: [
      "Pain in upper limb",
      "Severe pain in upper limb",
      "Elbow pain",
      "Pain when moving elbow",
      "Swollen elbow",
      "Elbow injury",
      "Joint hard to move",
    ],
    forearm: [
      "Pain in upper limb",
      "Pain in forearm",
      "Pain in both upper limbs",
      "Severe pain in upper limb",
      "Swelling of the upper limb",
      "Swollen elbow",
      "Swollen wrist",
      "Wrist pain",
      "Pain when moving wrist",
      "Elbow pain",
      "Pain when moving elbow",
      "Tingling or numbness of both upper limbs",
      "Dropping hand",
      "Loss of feeling in both arms",
      "Spasms in arms or hands",
      "Forearm injury",
      "Limb weakness",
      "Tingling or numbness of one upper limb",
    ],
    hand: [
      "Wrist pain",
      "Pain when moving wrist",
      "Pain in hand or fingers",
      "Pain in one finger",
      "Pain of the skin around the nail",
      "Swollen hand",
      "Swollen wrist",
      "Swollen finger",
      "Skin changes on hands",
      "Red hand",
      "Grayish-blue fingers",
      "Red skin on palms",
      "Tingling fingers",
      "Trembling of both hands",
      "Trembling of one hand",
      "Loss of muscles in hands",
      "Stiff hands in the morning",
      "Cold hands or fingers",
      "Hand injury",
    ],
    thigh: [
      "Pain in lower limb",
      "Severe pain in lower limb",
      "Thigh pain",
      "Pain in both lower limbs",
      "Hip pain",
      "Pain when moving hip",
      "Lower back pain spreading to the back of the thigh or knee",
      "Limping due to pain",
      "Acute thigh or buttock pain appearing during exertion and relieving after short rest",
      "Pain when pressing lower limb",
      "Swollen leg",
      "Hip swelling",
      "Swollen legs",
      "Tingling or numbness in one lower limb",
      "Tingling or numbness of both lower limbs",
      "Red stretch marks on stomach, hips, or thighs",
      "Thigh injury",
    ],
    legs: [
      "Pain in lower limb",
      "Severe pain in lower limb",
      "Thigh pain",
      "Pain in both lower limbs",
      "Hip pain",
      "Pain when moving hip",
      "Lower back pain spreading to the back of the thigh or knee",
      "Limping due to pain",
      "Acute thigh or buttock pain appearing during exertion and relieving after short rest",
      "Pain when pressing lower limb",
      "Swollen leg",
      "Hip swelling",
      "Swollen legs",
      "Tingling or numbness in one lower limb",
      "Tingling or numbness of both lower limbs",
      "Red stretch marks on stomach, hips, or thighs",
      "Thigh injury",
      "Pain in calf",
      "Pain when pressing calf",
      "Severe pain in calf while walking",
      "Pain in one knee",
      "Lower leg injury",
      "Heavy legs at the end of the day",
      "Loss of feeling in one arm or leg",
    ],
    knee: [
      "Pain in lower limb",
      "Severe pain in lower limb",
      "Pain in both lower limbs",
      "Pain in one knee",
      "Pain when moving knee",
      "Pain when pressing joint",
      "Stiff joints",
      "Limping due to pain",
      "Swollen knee",
      "Slower walk",
      "Creaking joints during movement",
      "Knee injury",
    ],
    lower_leg: [
      "Pain in lower limb",
      "Pain in both lower limbs",
      "Severe pain in lower limb",
      "Pain in calf",
      "Pain when pressing calf",
      "Severe pain in calf while walking",
      "Pain in one knee",
      "Swollen leg",
      "Swollen legs",
      "Tingling or numbness in one lower limb",
      "Tingling or numbness of both lower limbs",
      "Lower leg injury",
      "Heavy legs at the end of the day",
      "Loss of feeling in one arm or leg",
    ],
    foot: [
      "Pain in one foot",
      "Toe pain",
      "Sore nail",
      "Pain of the skin around the nail",
      "Ankle pain",
      "Big toe pain",
      "Tingling or numbness of both feet",
      "Swollen feet",
      "Swollen toe",
      "Skin changes on feet",
      "Thickened nails",
      "Enlarged fingertips and nails",
      "Dark nail discoloration",
      "White spots on nail",
      "Yellow nails",
      "Cold feet and toes",
      "Dropping the front of the foot",
      "Toe injury",
      "Pain in both feet",
      "Foot injury",
      "Swollen foot",
    ],
  };

  // Map organ SVG IDs to their Organ2 symptom key
  const ORGAN_TO_ORGAN2_KEY = {
    brain: "head",
    larynx_trachea: "neck_throat",
    thyroid: "neck_throat",
    liver: "upper_abdomen",
    lungs_right: "chest",
    lungs_left: "chest",
    heart: "chest",
    knee_joint: "knee",
    gallbladder: "upper_abdomen",
    spleen: "upper_abdomen",
    pancreas: "middle_abdomen",
    kidneys: "lower_back",
    stomach: "upper_abdomen",
    intestines: "lower_abdomen",
    muscle: "upper_arm",
    thymus: "chest",
    bladder: "lower_abdomen",
    male_reproductive: "sexual_organs_male",
    female_reproductive: "sexual_organs_female",
  };

  // Friendly display names for Organ2 symptom keys
  const ORGAN2_DISPLAY_NAMES = {
    head: "Head",
    ears: "Ears",
    eyes: "Eyes",
    nose: "Nose",
    oral_cavity: "Oral Cavity",
    neck_throat: "Neck or Throat",
    chest: "Chest",
    breasts: "Breasts",
    upper_abdomen: "Upper Abdomen",
    middle_abdomen: "Middle Abdomen",
    lower_abdomen: "Lower Abdomen",
    abdomen: "Abdomen",
    sexual_organs_female: "Sexual Organs (Female)",
    sexual_organs_male: "Sexual Organs (Male)",
    back: "Back",
    lower_back: "Lower Back",
    buttocks: "Buttocks",
    anus: "Anus",
    upper_arm: "Upper Arm",
    elbow: "Elbow",
    forearm: "Forearm",
    hand: "Hand",
    thigh: "Thigh",
    legs: "Legs",
    knee: "Knee",
    lower_leg: "Lower Leg",
    foot: "Foot",
  };

  // Map body part nav IDs (bp_xxx) to Organ2 symptom keys
  const BP_TO_ORGAN2_KEY = {
    bp_head: "head",
    bp_face: "head",
    bp_ears: "ears",
    bp_eyes: "eyes",
    bp_nose: "nose",
    bp_mouth: "oral_cavity",
    bp_gums: "oral_cavity",
    bp_teeth: "oral_cavity",
    bp_neck: "neck_throat",
    bp_throat: "neck_throat",
    bp_brain: "head",
    bp_heart: "chest",
    bp_blood: "chest",
    bp_lungs: "chest",
    bp_pancreas: "middle_abdomen",
    bp_adrenal: "lower_back",
    bp_parathyroid: "neck_throat",
    bp_pituitary: "head",
    bp_thyroid: "neck_throat",
    bp_esophagus: "neck_throat",
    bp_abdomen: "abdomen",
    bp_stomach: "upper_abdomen",
    bp_liver: "upper_abdomen",
    bp_intestines: "lower_abdomen",
    bp_gallbladder: "upper_abdomen",
    bp_colon: "lower_abdomen",
    bp_bladder: "lower_abdomen",
    bp_urethra: "lower_abdomen",
    bp_lymphnode: "neck_throat",
    bp_spleen: "upper_abdomen",
    bp_appendix: "lower_abdomen",
    bp_muscles: "upper_arm",
    bp_skin: "chest",
    bp_bones: "knee",
    bp_joints: "knee",
    bp_spine: "back",
    bp_back: "back",
    bp_ankles: "foot",
    bp_arms: "upper_arm",
    bp_chest: "chest",
    bp_elbow: "elbow",
    bp_feet: "foot",
    bp_hands: "hand",
    bp_hips: "buttocks",
    bp_butt: "buttocks",
    bp_anus: "anus",
    bp_kidneys: "lower_back",
    bp_legs: "legs",
    bp_pelvis: "lower_abdomen",
    bp_ribs: "chest",
    bp_shoulders: "upper_arm",
    bp_breasts: "breasts",
    bp_mammary: "breasts",
    bp_uterus: "sexual_organs_female",
    bp_penis: "sexual_organs_male",
    bp_prostate: "sexual_organs_male",
    bp_testicles: "sexual_organs_male",
    // --- New granular body parts ---
    bp_blood_vessels: "chest",
    bp_cartilage: "knee",
    bp_digestive_tract: "lower_abdomen",
    bp_fallopian_tubes: "sexual_organs_female",
    bp_fingers: "hand",
    bp_groin: "lower_abdomen",
    bp_hair: "head",
    bp_knee: "knee",
    bp_larynx: "neck_throat",
    bp_lips: "oral_cavity",
    bp_nails: "hand",
    bp_sinuses: "nose",
    bp_nerves: "head",
    bp_ovaries: "sexual_organs_female",
    bp_rectum: "lower_abdomen",
    bp_respiratory_tract: "chest",
    bp_salivary_glands: "oral_cavity",
    bp_scalp: "head",
    bp_skull: "head",
    bp_tendons: "upper_arm",
    bp_thigh: "thigh",
    bp_thymus: "chest",
    bp_toes: "foot",
    bp_tongue: "oral_cavity",
    bp_tonsils: "neck_throat",
    bp_urinary_tract: "lower_abdomen",
    bp_vagina: "sexual_organs_female",
    bp_vulva: "sexual_organs_female",
    bp_white_blood_cells: "chest",
  };

  // Approximate SVG coordinates for non-organ body parts (center of the body area)
  // Used to position the modal caret when clicking from left nav panel
  const BODY_PART_SVG_COORDS = {
    head: { x: 349, y: 80 },
    ears: { x: 390, y: 100 },
    eyes: { x: 349, y: 75 },
    nose: { x: 349, y: 95 },
    oral_cavity: { x: 349, y: 115 },
    neck_throat: { x: 349, y: 170 },
    chest: { x: 349, y: 340 },
    breasts: { x: 349, y: 330 },
    upper_abdomen: { x: 349, y: 470 },
    middle_abdomen: { x: 349, y: 560 },
    lower_abdomen: { x: 349, y: 650 },
    abdomen: { x: 349, y: 530 },
    sexual_organs_female: { x: 349, y: 720 },
    sexual_organs_male: { x: 349, y: 720 },
    back: { x: 349, y: 400 },
    lower_back: { x: 349, y: 550 },
    buttocks: { x: 349, y: 700 },
    anus: { x: 349, y: 730 },
    upper_arm: { x: 220, y: 380 },
    elbow: { x: 195, y: 480 },
    forearm: { x: 180, y: 540 },
    hand: { x: 155, y: 650 },
    thigh: { x: 300, y: 850 },
    legs: { x: 305, y: 950 },
    knee: { x: 310, y: 1000 },
    lower_leg: { x: 315, y: 1150 },
    foot: { x: 320, y: 1400 },
  };

  // Highlight ellipse regions for each body part on the Body Sections view.
  // Each entry defines {cx, cy, rx, ry} in SVG viewBox coords (0 0 698 1698).
  // Bilateral parts use an array of two regions (left + right, mirrored across x=349).
  const BODY_PART_HIGHLIGHT_REGIONS = {
    // --- Head & Neck (calibrated from zoomed grid overlay) ---
    bp_head: { cx: 345, cy: 160, rx: 63, ry: 75 },
    bp_face: { cx: 345, cy: 186, rx: 45, ry: 45 },
    bp_ears: [
      { cx: 280, cy: 180, rx: 7, ry: 22 },
      { cx: 410, cy: 180, rx: 7, ry: 22 },
    ],
    bp_eyes: [
      { cx: 310, cy: 175, rx: 10, ry: 6 },
      { cx: 380, cy: 175, rx: 10, ry: 6 },
    ],
    bp_nose: { cx: 345, cy: 200, rx: 6, ry: 8 },
    bp_mouth: { cx: 345, cy: 235, rx: 12, ry: 5 },
    bp_gums: { cx: 345, cy: 235, rx: 15, ry: 8 },
    bp_teeth: { cx: 345, cy: 235, rx: 10, ry: 4 },
    bp_neck: { cx: 345, cy: 290, rx: 42, ry: 18 },
    bp_throat: { cx: 345, cy: 290, rx: 16, ry: 18 },
    bp_brain: { cx: 345, cy: 100, rx: 38, ry: 35 },
    bp_pituitary: { cx: 345, cy: 112, rx: 8, ry: 8 },

    // --- Chest / Upper Body (organ image positions + grid calibration) ---
    bp_heart: { cx: 370, cy: 420, rx: 32, ry: 42 },
    bp_blood: { cx: 345, cy: 500, rx: 80, ry: 150 },
    bp_lungs: [
      { cx: 300, cy: 430, rx: 50, ry: 55 },
      { cx: 400, cy: 430, rx: 50, ry: 55 },
    ],
    bp_chest: { cx: 345, cy: 390, rx: 98, ry: 70 },
    bp_ribs: { cx: 345, cy: 400, rx: 82, ry: 65 },
    bp_breasts: [
      { cx: 295, cy: 455, rx: 40, ry: 40 },
      { cx: 405, cy: 455, rx: 40, ry: 40 },
    ],
    bp_mammary: [
      { cx: 295, cy: 455, rx: 24, ry: 20 },
      { cx: 405, cy: 455, rx: 24, ry: 20 },
    ],
    bp_thyroid: { cx: 350, cy: 320, rx: 22, ry: 20 },
    bp_esophagus: { cx: 345, cy: 360, rx: 14, ry: 95 },
    bp_thymus: { cx: 355, cy: 310, rx: 16, ry: 20 },
    bp_shoulders: [
      { cx: 230, cy: 330, rx: 32, ry: 20 },
      { cx: 490, cy: 330, rx: 32, ry: 20 },
    ],

    // --- Abdomen (organ image positions as reference) ---
    bp_abdomen: { cx: 345, cy: 650, rx: 78, ry: 110 },
    bp_stomach: { cx: 370, cy: 610, rx: 50, ry: 40 },
    bp_liver: { cx: 327, cy: 610, rx: 58, ry: 38 },
    bp_gallbladder: { cx: 304, cy: 570, rx: 14, ry: 18 },
    bp_spleen: { cx: 430, cy: 555, rx: 24, ry: 22 },
    bp_pancreas: { cx: 355, cy: 565, rx: 42, ry: 24 },
    bp_kidneys: [
      { cx: 310, cy: 620, rx: 28, ry: 25 },
      { cx: 410, cy: 620, rx: 28, ry: 25 },
    ],
    bp_adrenal: [
      { cx: 300, cy: 595, rx: 15, ry: 10 },
      { cx: 391, cy: 595, rx: 15, ry: 10 },
    ],
    bp_intestines: { cx: 355, cy: 690, rx: 80, ry: 60 },
    bp_colon: { cx: 355, cy: 710, rx: 85, ry: 55 },
    bp_appendix: { cx: 306, cy: 735, rx: 15, ry: 18 },
    bp_lymphnode: { cx: 345, cy: 205, rx: 24, ry: 16 },
    bp_parathyroid: { cx: 345, cy: 320, rx: 18, ry: 14 },

    // --- Lower Torso / Pelvis ---
    bp_pelvis: { cx: 345, cy: 760, rx: 75, ry: 40 },
    bp_hips: [
      { cx: 290, cy: 770, rx: 35, ry: 30 },
      { cx: 400, cy: 770, rx: 35, ry: 30 },
    ],
    bp_bladder: { cx: 355, cy: 810, rx: 35, ry: 30 },
    bp_urethra: { cx: 345, cy: 835, rx: 10, ry: 18 },
    bp_butt: { cx: 345, cy: 770, rx: 62, ry: 35 },
    bp_anus: { cx: 345, cy: 810, rx: 10, ry: 10 },
    bp_uterus: { cx: 355, cy: 830, rx: 48, ry: 30 },
    bp_penis: { cx: 355, cy: 870, rx: 30, ry: 40 },
    bp_prostate: { cx: 355, cy: 845, rx: 22, ry: 18 },
    bp_testicles: { cx: 355, cy: 905, rx: 26, ry: 22 },

    // --- Arms (grid-calibrated from body outline) ---
    bp_arms: [
      { cx: 225, cy: 480, rx: 20, ry: 140 },
      { cx: 465, cy: 480, rx: 20, ry: 140 },
    ],
    bp_elbow: [
      { cx: 205, cy: 530, rx: 16, ry: 22 },
      { cx: 485, cy: 530, rx: 16, ry: 22 },
    ],
    bp_hands: [
      { cx: 135, cy: 840, rx: 22, ry: 35 },
      { cx: 575, cy: 840, rx: 22, ry: 35 },
    ],

    // --- Legs (grid-calibrated from body outline) ---
    bp_legs: [
      { cx: 310, cy: 1100, rx: 30, ry: 200 },
      { cx: 400, cy: 1100, rx: 30, ry: 200 },
    ],
    bp_thigh: [
      { cx: 310, cy: 930, rx: 32, ry: 70 },
      { cx: 400, cy: 930, rx: 32, ry: 70 },
    ],
    bp_knee: [
      { cx: 305, cy: 1190, rx: 22, ry: 30 },
      { cx: 400, cy: 1190, rx: 22, ry: 30 },
    ],
    bp_ankles: [
      { cx: 300, cy: 1490, rx: 15, ry: 18 },
      { cx: 410, cy: 1490, rx: 15, ry: 18 },
    ],
    bp_feet: [
      { cx: 290, cy: 1540, rx: 28, ry: 45 },
      { cx: 420, cy: 1540, rx: 28, ry: 45 },
    ],

    // --- Whole-body / diffuse ---
    bp_muscles: { cx: 345, cy: 600, rx: 90, ry: 250 },
    bp_skin: { cx: 345, cy: 600, rx: 100, ry: 280 },
    bp_bones: { cx: 345, cy: 600, rx: 80, ry: 260 },
    bp_joints: [
      { cx: 305, cy: 1190, rx: 22, ry: 30 },
      { cx: 400, cy: 1190, rx: 22, ry: 30 },
    ],
    bp_spine: { cx: 345, cy: 500, rx: 15, ry: 200 },
    bp_back: { cx: 345, cy: 450, rx: 70, ry: 140 },

    // --- New granular body parts ---
    // Head subparts
    bp_scalp: { cx: 345, cy: 80, rx: 40, ry: 25 },
    bp_skull: { cx: 345, cy: 120, rx: 42, ry: 50 },
    bp_hair: { cx: 345, cy: 75, rx: 42, ry: 22 },
    bp_sinuses: { cx: 345, cy: 185, rx: 18, ry: 14 },
    bp_lips: { cx: 345, cy: 240, rx: 14, ry: 5 },
    bp_tongue: { cx: 345, cy: 245, rx: 10, ry: 8 },
    bp_salivary_glands: [
      { cx: 305, cy: 225, rx: 12, ry: 10 },
      { cx: 385, cy: 225, rx: 12, ry: 10 },
    ],
    // Throat subparts
    bp_larynx: { cx: 345, cy: 280, rx: 14, ry: 12 },
    bp_tonsils: [
      { cx: 332, cy: 268, rx: 6, ry: 6 },
      { cx: 358, cy: 268, rx: 6, ry: 6 },
    ],
    // Systemic/diffuse
    bp_blood_vessels: { cx: 345, cy: 500, rx: 75, ry: 140 },
    bp_nerves: { cx: 345, cy: 500, rx: 70, ry: 200 },
    bp_cartilage: { cx: 345, cy: 700, rx: 75, ry: 200 },
    bp_tendons: { cx: 345, cy: 800, rx: 80, ry: 200 },
    bp_white_blood_cells: { cx: 345, cy: 500, rx: 65, ry: 130 },
    bp_respiratory_tract: { cx: 345, cy: 400, rx: 80, ry: 70 },
    bp_digestive_tract: { cx: 355, cy: 650, rx: 70, ry: 120 },
    // Abdomen/Pelvis subparts
    bp_rectum: { cx: 355, cy: 770, rx: 16, ry: 16 },
    bp_groin: [
      { cx: 310, cy: 800, rx: 25, ry: 20 },
      { cx: 400, cy: 800, rx: 25, ry: 20 },
    ],
    bp_urinary_tract: { cx: 355, cy: 820, rx: 28, ry: 35 },
    // Reproductive subparts
    bp_ovaries: [
      { cx: 320, cy: 820, rx: 14, ry: 12 },
      { cx: 390, cy: 820, rx: 14, ry: 12 },
    ],
    bp_fallopian_tubes: [
      { cx: 330, cy: 815, rx: 25, ry: 12 },
      { cx: 380, cy: 815, rx: 25, ry: 12 },
    ],
    bp_vagina: { cx: 355, cy: 850, rx: 18, ry: 22 },
    bp_vulva: { cx: 355, cy: 865, rx: 22, ry: 15 },
    // Extremity subparts
    bp_fingers: [
      { cx: 135, cy: 825, rx: 18, ry: 20 },
      { cx: 575, cy: 825, rx: 18, ry: 20 },
    ],
    bp_toes: [
      { cx: 280, cy: 1570, rx: 18, ry: 12 },
      { cx: 430, cy: 1570, rx: 18, ry: 12 },
    ],
    bp_nails: [
      { cx: 135, cy: 855, rx: 12, ry: 8 },
      { cx: 575, cy: 855, rx: 12, ry: 8 },
    ],
  };

  // === SHARED STATE ===
  const selectedOrgans = new Set();
  const selectedSections = new Set();
  const selectedSymptoms = new Map(); // key: "sectionId::symptomName", value: { section, symptom, sectionName }
  let currentView = "sections"; // 'organs', 'organs2', or 'sections'
  let currentGender = "male";
  let isFlipped = false;
  let organ2HighlightedGroup = null; // tracks the highlighted organ in organs2 mode

  // === SYMPTOM SEARCH STATE ===
  let searchDebounceTimer = null;
  let currentModalContext = null; // { type: 'section'|'organ2', key, name }
  let searchFirstKeystroke = true;

  // Full symptom list loaded via <script src="symptoms-data.js">
  var FULL_SYMPTOMS = window.SYMPTOMS_DATA || null;

  function filterSymptoms(query) {
    var lowerQuery = query.toLowerCase();
    // Search the full 18K list if loaded, otherwise search inline arrays for current region
    var pool;
    if (FULL_SYMPTOMS) {
      pool = FULL_SYMPTOMS;
    } else {
      var ctx = currentModalContext;
      pool =
        ctx.type === "section"
          ? SECTION_SYMPTOMS[ctx.key] || []
          : ORGAN2_SYMPTOMS[ctx.key] || [];
    }
    var results = [];
    for (var i = 0; i < pool.length && results.length < 50; i++) {
      if (pool[i].toLowerCase().indexOf(lowerQuery) !== -1) {
        results.push(pool[i]);
      }
    }
    return results;
  }

  function renderSkeletonList() {
    symptomModalList.textContent = "";
    var widths = [
      "long",
      "medium",
      "short",
      "long",
      "medium",
      "short",
      "medium",
    ];
    widths.forEach(function (w) {
      var li = document.createElement("li");
      li.className = "symptom-skeleton-item";
      var bar = document.createElement("div");
      bar.className = "symptom-skeleton-bar " + w;
      li.appendChild(bar);
      symptomModalList.appendChild(li);
    });
  }

  function renderModalSymptomItems(
    symptoms,
    regionKey,
    displayName,
    sourceType,
  ) {
    symptomModalList.textContent = "";
    if (symptoms.length === 0) {
      var noResults = document.createElement("li");
      noResults.className = "no-results";
      noResults.textContent = "No matching symptoms found";
      symptomModalList.appendChild(noResults);
      return;
    }
    symptoms.forEach(function (symptom) {
      var key = regionKey + "::" + symptom;
      var isSelected = selectedSymptoms.has(key);
      var li = document.createElement("li");
      if (isSelected) li.className = "selected";
      li.dataset.key = key;

      var nameSpan = document.createElement("span");
      nameSpan.textContent = symptom;
      li.appendChild(nameSpan);

      if (isSelected) {
        var checkSpan = document.createElement("span");
        checkSpan.className = "symptom-check";
        checkSpan.textContent = "\u2713";
        li.appendChild(checkSpan);
      }

      li.addEventListener("click", function () {
        if (sourceType === "section") {
          window._selectSymptom(regionKey, displayName, symptom);
        } else {
          window._selectOrgan2Symptom(regionKey, displayName, symptom);
        }
      });

      symptomModalList.appendChild(li);
    });
  }

  function getDefaultSymptoms(ctx) {
    return ctx.type === "section"
      ? SECTION_SYMPTOMS[ctx.key] || []
      : ORGAN2_SYMPTOMS[ctx.key] || [];
  }

  // --- View toggle ---
  let initialViewLoaded = false;
  window.setView = function (view) {
    currentView = view;

    // Close symptom modal when switching views
    closeSymptomModal();

    // Get layer elements
    const organsLayer = document.getElementById("organs-layer");
    const sectionsLayer = document.getElementById("sections-layer");
    const backSectionsLayer = document.getElementById("back-sections-layer");
    const bpLayer = document.getElementById("bp-highlight-layer");

    const isOrgansView = view === "organs" || view === "organs2";
    const isSectionsView = view === "sections";
    const showFrontSections = isSectionsView && !isFlipped;
    const showBackSections = isSectionsView && isFlipped;

    // On initial load, skip the fade animation since layers are already
    // set to correct visibility via inline styles
    if (!initialViewLoaded) {
      initialViewLoaded = true;
      // Just set display properties without animation
      organsLayer.style.display = isOrgansView ? "" : "none";
      sectionsLayer.style.display = showFrontSections ? "" : "none";
      backSectionsLayer.style.display = showBackSections ? "" : "none";

      if (showFrontSections) {
        bpLayer.style.display = "";
        // Re-create ellipses for any body parts already selected
        while (bpLayer.firstChild) bpLayer.removeChild(bpLayer.firstChild);
        selectedBodyParts.forEach((bpId) => {
          const regionData = BODY_PART_HIGHLIGHT_REGIONS[bpId];
          if (!regionData) return;
          const regions = Array.isArray(regionData) ? regionData : [regionData];
          regions.forEach((r) => {
            const ellipse = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "ellipse",
            );
            ellipse.setAttribute("cx", r.cx);
            ellipse.setAttribute("cy", r.cy);
            ellipse.setAttribute("rx", r.rx);
            ellipse.setAttribute("ry", r.ry);
            ellipse.setAttribute("class", "bp-highlight-ellipse");
            ellipse.setAttribute("data-bp-id", bpId);
            makeEllipseClickable(ellipse, bpId);
            bpLayer.appendChild(ellipse);
          });
        });
        updateSectionHitAreaState();
      } else {
        if (bpLayer) {
          bpLayer.style.display = "none";
          while (bpLayer.firstChild) bpLayer.removeChild(bpLayer.firstChild);
        }
      }

      // Set initial opacities
      organsLayer.style.opacity = isOrgansView ? "1" : "0";
      sectionsLayer.style.opacity = showFrontSections ? "1" : "0";
      backSectionsLayer.style.opacity = showBackSections ? "1" : "0";
      bpLayer.style.opacity = showFrontSections ? "1" : "0";
    } else {
      // Smooth crossfade transition for subsequent view switches
      // First, fade out all layers
      organsLayer.style.opacity = "0";
      sectionsLayer.style.opacity = "0";
      backSectionsLayer.style.opacity = "0";
      if (bpLayer) bpLayer.style.opacity = "0";

      // After a brief delay, set display properties and fade in the target layer
      setTimeout(function () {
        // Set display properties
        organsLayer.style.display = isOrgansView ? "" : "none";
        sectionsLayer.style.display = showFrontSections ? "" : "none";
        backSectionsLayer.style.display = showBackSections ? "" : "none";

        // Show/hide body-part highlight overlay on sections view
        if (showFrontSections) {
          bpLayer.style.display = "";
          // Re-create ellipses for any body parts already selected
          while (bpLayer.firstChild) bpLayer.removeChild(bpLayer.firstChild);
          selectedBodyParts.forEach((bpId) => {
            const regionData = BODY_PART_HIGHLIGHT_REGIONS[bpId];
            if (!regionData) return;
            const regions = Array.isArray(regionData)
              ? regionData
              : [regionData];
            regions.forEach((r) => {
              const ellipse = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "ellipse",
              );
              ellipse.setAttribute("cx", r.cx);
              ellipse.setAttribute("cy", r.cy);
              ellipse.setAttribute("rx", r.rx);
              ellipse.setAttribute("ry", r.ry);
              ellipse.setAttribute("class", "bp-highlight-ellipse");
              ellipse.setAttribute("data-bp-id", bpId);
              makeEllipseClickable(ellipse, bpId);
              bpLayer.appendChild(ellipse);
            });
          });
          updateSectionHitAreaState();
          // Fade in sections and highlight layer
          sectionsLayer.style.opacity = "1";
          bpLayer.style.opacity = "1";
        } else {
          if (bpLayer) {
            bpLayer.style.display = "none";
            while (bpLayer.firstChild) bpLayer.removeChild(bpLayer.firstChild);
            bpLayer.style.opacity = "0";
          }
          // Remove disabled state when leaving sections view
          sectionsLayer.classList.remove("sections-disabled");
          // Fade in the appropriate layer
          if (isOrgansView) {
            organsLayer.style.opacity = "1";
          } else if (showBackSections) {
            backSectionsLayer.style.opacity = "1";
          }
        }
      }, 50);
    }

    // Toggle active tab
    const btnOrgans = document.getElementById("btn-organs");
    const btnOrgans2 = document.getElementById("btn-organs2");
    const btnSections = document.getElementById("btn-sections");
    btnOrgans.classList.toggle("active", view === "organs");
    btnOrgans2.classList.toggle("active", view === "organs2");
    btnOrgans2.classList.toggle("organs2-active", view === "organs2");
    btnSections.classList.toggle("active", view === "sections");
    btnSections.classList.toggle("sections-active", view === "sections");

    // Toggle gender controls (relevant for organs and organs2)
    document.querySelector(".gender-toggle").style.display = isOrgansView
      ? "flex"
      : "none";

    // Hide rotate button on organs/organs2 tab, show on sections tab
    document.getElementById("rotateLink").style.display =
      view === "sections" ? "" : "none";
  };

  // --- Gender toggle ---
  window.setGender = function (gender) {
    currentGender = gender;
    document
      .getElementById("btn-male")
      .classList.toggle("active", gender === "male");
    document
      .getElementById("btn-female")
      .classList.toggle("active", gender === "female");

    document.querySelectorAll(".male-repro").forEach((el) => {
      el.style.visibility = gender === "male" ? "visible" : "hidden";
    });
    document.querySelectorAll(".female-repro").forEach((el) => {
      el.style.visibility = gender === "female" ? "visible" : "hidden";
    });

    // If the hidden gender's part was selected, deselect it
    const hideKey =
      gender === "male" ? "female_reproductive" : "male_reproductive";
    if (selectedOrgans.has(hideKey)) {
      selectedOrgans.delete(hideKey);
      const g = document.getElementById("group-" + hideKey);
      if (g) g.classList.remove("selected");
      renderSelectedList();
    }

    // If reproductive system is active, swap body parts to match new gender
    if (activeSystem === "reproductive") {
      var oldGender = gender === "male" ? "female" : "male";
      var oldBpIds = REPRODUCTIVE_BODY_PARTS[oldGender] || [];
      var newBpIds = REPRODUCTIVE_BODY_PARTS[gender] || [];
      var bpLayer = document.getElementById("bp-highlight-layer");

      // Remove old gender's body parts
      oldBpIds.forEach(function (bpId) {
        systemSelectedBodyParts.delete(bpId);
        selectedBodyParts.delete(bpId);
        if (bpLayer) {
          bpLayer
            .querySelectorAll('[data-bp-id="' + bpId + '"]')
            .forEach(function (el) {
              el.remove();
            });
        }
      });

      // Add new gender's body parts
      newBpIds.forEach(function (bpId) {
        if (!selectedBodyParts.has(bpId)) {
          systemSelectedBodyParts.add(bpId);
        }
        selectedBodyParts.add(bpId);

        // Highlight SVG organs
        var bp = BODY_PARTS_DATA.find(function (b) {
          return b.id === bpId;
        });
        if (bp && bp.organIds) {
          bp.organIds.forEach(function (organId) {
            selectedOrgans.add(organId);
            var group = document.getElementById("group-" + organId);
            if (group) group.classList.add("selected");
          });
        }

        // Add section ellipses if in sections view
        if (currentView === "sections" && bpLayer) {
          var regionData = BODY_PART_HIGHLIGHT_REGIONS[bpId];
          if (regionData) {
            var regions = Array.isArray(regionData) ? regionData : [regionData];
            regions.forEach(function (r) {
              var ellipse = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "ellipse",
              );
              ellipse.setAttribute("cx", r.cx);
              ellipse.setAttribute("cy", r.cy);
              ellipse.setAttribute("rx", r.rx);
              ellipse.setAttribute("ry", r.ry);
              ellipse.setAttribute("class", "bp-highlight-ellipse");
              ellipse.setAttribute("data-bp-id", bpId);
              makeEllipseClickable(ellipse, bpId);
              bpLayer.appendChild(ellipse);
            });
          }
        }
      });

      if (currentView === "sections") updateSectionHitAreaState();
      renderBodyPartsNavPanel();
      renderBodyPartCards();
    }
  };

  // --- Rotate model ---
  window.rotateModel = function () {
    const inner = document.getElementById("svgInner");
    const sectionsLayer = document.getElementById("sections-layer");
    const backSectionsLayer = document.getElementById("back-sections-layer");
    const flipDuration = 700; // matches CSS transition: 0.7s

    isFlipped = !isFlipped;

    if (currentView === "sections") {
      // Show both layers during the flip so backface-visibility handles it
      sectionsLayer.style.display = "";
      backSectionsLayer.style.display = "";
      sectionsLayer.style.opacity = "1";
      backSectionsLayer.style.opacity = "1";

      // After the animation completes, hide the inactive layer
      setTimeout(function () {
        sectionsLayer.style.display = isFlipped ? "none" : "";
        backSectionsLayer.style.display = isFlipped ? "" : "none";
        sectionsLayer.style.opacity = isFlipped ? "0" : "1";
        backSectionsLayer.style.opacity = isFlipped ? "1" : "0";
      }, flipDuration);

      // Hide body-part highlights when flipped to back (no back regions defined yet)
      const bpLayer = document.getElementById("bp-highlight-layer");
      bpLayer.style.display = isFlipped ? "none" : "";
      bpLayer.style.opacity = isFlipped ? "0" : "1";
    }

    inner.classList.toggle("flipped", isFlipped);

    const link = document.getElementById("rotateLink");
    link.textContent = isFlipped
      ? "\u21BB Rotate to Front"
      : "\u21BB Rotate Model";
  };

  // --- Organs2: clear temporary highlight ---
  function clearOrgan2Highlight() {
    if (organ2HighlightedGroup) {
      organ2HighlightedGroup.classList.remove("selected");
      organ2HighlightedGroup = null;
    }
  }

  // --- Click to select/deselect ORGANS ---
  document.querySelectorAll(".body-part-group .hit-area").forEach((hitArea) => {
    const group = hitArea.closest(".body-part-group");
    const partId = group.dataset.part;

    hitArea.addEventListener("click", function (e) {
      e.stopPropagation();

      // Don't allow selecting hidden gender layers
      if (partId === "male_reproductive" && currentGender !== "male") return;
      if (partId === "female_reproductive" && currentGender !== "female")
        return;

      // Organs2 mode: open symptom modal instead of toggling selection
      if (currentView === "organs2") {
        const organ2Key = ORGAN_TO_ORGAN2_KEY[partId];
        if (organ2Key) {
          // Use the organ's actual SVG name (e.g., "Brain", "Left Lung")
          const displayName = group.dataset.name;
          // Highlight this organ while modal is open
          clearOrgan2Highlight();
          group.classList.add("selected");
          organ2HighlightedGroup = group;
          openOrgan2Modal(organ2Key, displayName, e);
        }
        return;
      }

      if (selectedOrgans.has(partId)) {
        selectedOrgans.delete(partId);
        group.classList.remove("selected");
      } else {
        selectedOrgans.add(partId);
        group.classList.add("selected");
      }
      clearActiveSystemUI();
      syncBodyPartsFromOrgan(partId, selectedOrgans.has(partId));
      renderSelectedList();
    });
  });

  // --- Helper: get all groups for a section (handles paired groups like arms) ---
  function getSectionGroups(partId) {
    return document.querySelectorAll(
      `.body-section-group[data-part="${partId}"]`,
    );
  }

  // --- Click to select/deselect SECTIONS ---
  document
    .querySelectorAll(".body-section-group .section-hit-area")
    .forEach((hitArea) => {
      const group = hitArea.closest(".body-section-group");
      const partId = group.dataset.part;

      hitArea.addEventListener("click", function (e) {
        e.stopPropagation();

        const allGroups = getSectionGroups(partId);
        const partName = group.dataset.name;

        // If already selected, deselect it (toggle off)
        if (selectedSections.has(partId)) {
          selectedSections.delete(partId);
          allGroups.forEach((g) => {
            g.classList.remove("selected");
            const img = g.querySelector(".section-image");
            if (img) img.style.opacity = "0";
          });
          renderSelectedList();
          closeSymptomModal();
          return;
        }

        // Deselect all currently selected sections first (single-select)
        selectedSections.forEach((prevPartId) => {
          getSectionGroups(prevPartId).forEach((g) => {
            g.classList.remove("selected");
            const img = g.querySelector(".section-image");
            if (img) img.style.opacity = "0";
          });
        });
        selectedSections.clear();

        // Select this section
        selectedSections.add(partId);
        allGroups.forEach((g) => {
          g.classList.add("selected");
          const img = g.querySelector(".section-image");
          if (img) img.style.opacity = "0.45";
        });
        renderSelectedList();

        // Open symptom modal at click position
        openSymptomModal(partId, partName, e);
      });

      // Hover: show/hide ALL paired section overlay images
      group.addEventListener("mouseenter", function () {
        if (!selectedSections.has(partId)) {
          getSectionGroups(partId).forEach((g) => {
            const img = g.querySelector(".section-image");
            if (img) img.style.opacity = "0.6";
          });
        }
      });
      group.addEventListener("mouseleave", function () {
        if (!selectedSections.has(partId)) {
          getSectionGroups(partId).forEach((g) => {
            const img = g.querySelector(".section-image");
            if (img) img.style.opacity = "0";
          });
        }
      });
    });

  // --- Symptom Modal Functions ---
  const symptomModalOverlay = document.getElementById("symptomModalOverlay");
  const symptomModal = document.getElementById("symptomModal");
  const symptomModalCarat = document.getElementById("symptomModalCarat");
  const symptomModalBackdrop = document.getElementById("symptomModalBackdrop");
  const symptomModalTitle = document.getElementById("symptomModalTitle");
  const symptomModalList = document.getElementById("symptomModalList");
  const symptomModalClose = document.getElementById("symptomModalClose");

  // Store last click position for re-renders (symptom toggle)
  let lastModalClickEvent = null;

  function positionModal(e) {
    if (!e) return;

    const clickX = e.clientX;
    const clickY = e.clientY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const modalW = Math.min(520, vw - 32);
    const modalH = Math.min(440, vh * 0.7);
    const caratSize = 14;
    const gap = 12;

    // Decide: place modal to the LEFT or RIGHT of click
    const placeRight = clickX < vw / 2;

    let modalLeft, modalTop, caratLeft, caratTop;

    if (placeRight) {
      // Modal to the right of the click
      modalLeft = clickX + gap + caratSize;
    } else {
      // Modal to the left of the click
      modalLeft = clickX - gap - caratSize - modalW;
    }

    // Vertical: center modal on click Y, then clamp
    modalTop = clickY - 40;

    // Clamp within viewport
    modalLeft = Math.max(12, Math.min(modalLeft, vw - modalW - 12));
    modalTop = Math.max(12, Math.min(modalTop, vh - modalH - 12));

    // Position carat
    if (placeRight) {
      caratLeft = modalLeft - caratSize / 2 + 1;
    } else {
      caratLeft = modalLeft + modalW - caratSize / 2 - 1;
    }
    caratTop = clickY - caratSize / 2;

    // Clamp carat vertically within the modal's header area
    const headerBottom = modalTop + 48;
    caratTop = Math.max(modalTop + 12, Math.min(caratTop, headerBottom));

    // Apply styles
    symptomModal.style.left = modalLeft + "px";
    symptomModal.style.top = modalTop + "px";
    symptomModal.style.width = modalW + "px";
    symptomModal.style.maxHeight = modalH + "px";

    symptomModalCarat.style.left = caratLeft + "px";
    symptomModalCarat.style.top = caratTop + "px";

    // Adjust carat shadow direction based on side
    if (placeRight) {
      symptomModalCarat.style.boxShadow = "-2px -2px 4px rgba(0, 0, 0, 0.06)";
    } else {
      symptomModalCarat.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.06)";
    }
  }

  function openSymptomModal(sectionId, sectionName, e) {
    if (e) lastModalClickEvent = e;
    symptomModalTitle.textContent = sectionName;

    // Set modal context for search
    currentModalContext = {
      type: "section",
      key: sectionId,
      name: sectionName,
    };
    searchFirstKeystroke = true;

    // Reset search input
    var searchInput = document.getElementById("symptomSearchInput");
    searchInput.value = "";

    // Render default symptoms
    var symptoms = SECTION_SYMPTOMS[sectionId] || [];
    renderModalSymptomItems(symptoms, sectionId, sectionName, "section");

    // Position modal near the click point
    positionModal(lastModalClickEvent);

    // Show with animation
    symptomModalOverlay.classList.remove("closing");
    symptomModalOverlay.classList.add("active");

    // Auto-focus search input
    requestAnimationFrame(function () {
      searchInput.focus();
    });

    // Full symptom data loaded synchronously via script tag
  }

  function closeSymptomModal() {
    symptomModalOverlay.classList.add("closing");
    // Clear organs2 highlight when modal closes
    clearOrgan2Highlight();
    // Deselect any selected body sections when modal closes
    selectedSections.forEach(function (partId) {
      getSectionGroups(partId).forEach(function (g) {
        g.classList.remove("selected");
        var img = g.querySelector(".section-image");
        if (img) img.style.opacity = "0";
      });
    });
    selectedSections.clear();
    // Wait for close animation to finish then hide
    setTimeout(function () {
      symptomModalOverlay.classList.remove("active");
      symptomModalOverlay.classList.remove("closing");
    }, 240);
  }

  // Convert SVG coordinates to screen coordinates for modal positioning
  function svgCoordsToScreen(svgX, svgY) {
    const svg = document.querySelector(".body-model-svg");
    if (!svg)
      return {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2,
      };
    const pt = svg.createSVGPoint();
    pt.x = svgX;
    pt.y = svgY;
    const screenPt = pt.matrixTransform(svg.getScreenCTM());
    return { clientX: screenPt.x, clientY: screenPt.y };
  }

  // Open the symptom modal for Organs2 view
  function openOrgan2Modal(organ2Key, displayName, eventOrCoords) {
    symptomModalTitle.textContent = displayName;

    // Set modal context for search
    currentModalContext = {
      type: "organ2",
      key: organ2Key,
      name: displayName,
    };
    searchFirstKeystroke = true;

    // Reset search input
    var searchInput = document.getElementById("symptomSearchInput");
    searchInput.value = "";

    // Render default symptoms
    var symptoms = ORGAN2_SYMPTOMS[organ2Key] || [];
    renderModalSymptomItems(symptoms, organ2Key, displayName, "organ2");

    // Position modal
    if (eventOrCoords && eventOrCoords.clientX !== undefined) {
      lastModalClickEvent = eventOrCoords;
    }
    positionModal(lastModalClickEvent);

    // Show with animation
    symptomModalOverlay.classList.remove("closing");
    symptomModalOverlay.classList.add("active");

    // Auto-focus search input
    requestAnimationFrame(function () {
      searchInput.focus();
    });

    // Full symptom data loaded synchronously via script tag
  }

  // Toggle symptom selection in Organs2 mode
  // Re-render modal list preserving current search state
  function rerenderModalList(regionKey, displayName, sourceType) {
    var searchInput = document.getElementById("symptomSearchInput");
    var query = searchInput ? searchInput.value.trim() : "";
    if (query.length > 0) {
      var results = filterSymptoms(query);
      renderModalSymptomItems(results, regionKey, displayName, sourceType);
    } else {
      renderModalSymptomItems(
        getDefaultSymptoms(currentModalContext),
        regionKey,
        displayName,
        sourceType,
      );
    }
  }

  window._selectOrgan2Symptom = function (organ2Key, displayName, symptom) {
    const key = organ2Key + "::" + symptom;
    if (selectedSymptoms.has(key)) {
      selectedSymptoms.delete(key);
    } else {
      selectedSymptoms.set(key, {
        section: organ2Key,
        symptom: symptom,
        sectionName: displayName,
      });
    }
    rerenderModalList(organ2Key, displayName, "organ2");
    renderSymptomsList();
  };

  window._selectSymptom = function (sectionId, sectionName, symptom) {
    const key = sectionId + "::" + symptom;
    if (selectedSymptoms.has(key)) {
      selectedSymptoms.delete(key);
    } else {
      selectedSymptoms.set(key, {
        section: sectionId,
        symptom: symptom,
        sectionName: sectionName,
      });
    }
    rerenderModalList(sectionId, sectionName, "section");
    renderSymptomsList();
  };

  window._removeSymptom = function (key) {
    selectedSymptoms.delete(key);
    renderSymptomsList();
  };

  function renderSymptomsList() {
    const panel = document.getElementById("currentSymptomsPanel");
    const listEl = document.getElementById("symptomsList");

    if (selectedSymptoms.size === 0) {
      panel.style.display = "none";
      listEl.textContent = "";
      return;
    }

    panel.style.display = "block";

    // Group by section
    const groups = {};
    selectedSymptoms.forEach(function (val, key) {
      if (!groups[val.section]) {
        groups[val.section] = { sectionName: val.sectionName, items: [] };
      }
      groups[val.section].items.push({ key: key, symptom: val.symptom });
    });

    // Build pills using DOM methods
    listEl.textContent = "";
    for (var sectionId in groups) {
      var g = groups[sectionId];
      var label = document.createElement("li");
      label.className = "symptom-section-label";
      label.textContent = g.sectionName;
      listEl.appendChild(label);

      g.items.forEach(function (item) {
        var pill = document.createElement("li");
        pill.className = "symptom-pill";

        var nameSpan = document.createElement("span");
        nameSpan.className = "symptom-pill-name";
        nameSpan.textContent = item.symptom;
        pill.appendChild(nameSpan);

        var removeBtn = document.createElement("button");
        removeBtn.className = "symptom-pill-remove";
        removeBtn.textContent = "\u00d7";
        removeBtn.addEventListener(
          "click",
          (function (k) {
            return function () {
              window._removeSymptom(k);
            };
          })(item.key),
        );
        pill.appendChild(removeBtn);

        listEl.appendChild(pill);
      });
    }
  }

  // Close modal on X button
  symptomModalClose.addEventListener("click", closeSymptomModal);

  // Close modal on backdrop click
  symptomModalBackdrop.addEventListener("click", closeSymptomModal);

  // Close modal on Escape key
  document.addEventListener("keydown", function (e) {
    if (
      e.key === "Escape" &&
      symptomModalOverlay.classList.contains("active")
    ) {
      closeSymptomModal();
    }
  });

  // === Symptom search input handler ===
  (function setupSearchHandler() {
    var searchInput = document.getElementById("symptomSearchInput");
    searchInput.addEventListener("input", function () {
      var query = searchInput.value.trim();

      if (query.length === 0) {
        // Reset to default symptom list
        searchFirstKeystroke = true;
        clearTimeout(searchDebounceTimer);
        var ctx = currentModalContext;
        if (ctx) {
          renderModalSymptomItems(
            getDefaultSymptoms(ctx),
            ctx.key,
            ctx.name,
            ctx.type,
          );
        }
        return;
      }

      // First keystroke: show skeleton for 1 second, then filter
      if (searchFirstKeystroke) {
        searchFirstKeystroke = false;
        renderSkeletonList();
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(function () {
          var q = searchInput.value.trim();
          if (q.length === 0) return;
          var ctx = currentModalContext;
          var results = filterSymptoms(q);
          renderModalSymptomItems(results, ctx.key, ctx.name, ctx.type);
        }, 1000);
        return;
      }

      // Subsequent keystrokes: 250ms debounce
      clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function () {
        var q = searchInput.value.trim();
        if (q.length === 0) return;
        var ctx = currentModalContext;
        var results = filterSymptoms(q);
        renderModalSymptomItems(results, ctx.key, ctx.name, ctx.type);
      }, 250);
    });
  })();

  // --- Render selected list (removed — pill panel no longer exists) ---
  function renderSelectedList() {}

  window.deselectPart = function () {};

  // --- Touch support for mobile ---
  document.querySelectorAll(".body-part-group .hit-area").forEach((hitArea) => {
    hitArea.addEventListener(
      "touchstart",
      function (e) {
        // Let the click handler deal with selection
      },
      { passive: true },
    );
  });

  document
    .querySelectorAll(".body-section-group .section-hit-area")
    .forEach((hitArea) => {
      hitArea.addEventListener(
        "touchstart",
        function (e) {
          // Let the click handler deal with selection
        },
        { passive: true },
      );
    });
  document
    .getElementById("tooltipClose")
    .addEventListener("click", function () {
      deselectSystem();
    });
  renderSystemsSidebar();

  // --- Collapsible panels ---
  document
    .getElementById("systemsHeader")
    .addEventListener("click", function () {
      document.getElementById("systemsPanel").classList.toggle("collapsed");
    });
  document
    .getElementById("bodyPartsNavHeader")
    .addEventListener("click", function () {
      document
        .getElementById("bodyPartsNavPanel")
        .classList.toggle("collapsed");
    });

  // --- Body Parts nav panel data ---
  const BODY_PARTS_DATA = [
    {
      id: "bp_head",
      name: "Head",
      image: "bpart_images/head.png",
      organIds: [],
      description:
        "The head houses the brain, sensory organs, and facial structures. It is protected by the skull and connected to the body via the neck and spinal column.",
    },
    {
      id: "bp_face",
      name: "Face",
      image: "bpart_images/face.png",
      organIds: [],
      description:
        "The face contains the eyes, nose, mouth, and cheeks. Facial muscles enable expressions and control eating, breathing, and communication.",
    },
    {
      id: "bp_ears",
      name: "Ears",
      image: "bpart_images/ear.png",
      organIds: [],
      description:
        "The ears are responsible for hearing and balance. Sound waves are captured by the outer ear and transmitted to the cochlea, which converts vibrations into nerve signals.",
    },
    {
      id: "bp_eyes",
      name: "Eyes",
      image: "bpart_images/eye.png",
      organIds: [],
      description:
        "The eyes are sensory organs that detect light and convert it into electrical signals sent to the brain. They enable vision, depth perception, and color recognition.",
    },
    {
      id: "bp_nose",
      name: "Nose",
      image: "bpart_images/nose.png",
      organIds: [],
      description:
        "The nose filters, warms, and humidifies inhaled air. It also houses olfactory receptors that detect scents and is connected to the sinuses.",
    },
    {
      id: "bp_mouth",
      name: "Mouth",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "The mouth is the entry point of the digestive system, used for eating, drinking, speaking, and breathing. It contains the teeth, tongue, and gums.",
    },
    {
      id: "bp_gums",
      name: "Gums",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "Gums (gingiva) are soft tissue lining the mouth and surround the base of the teeth. Healthy gums provide a protective seal around each tooth.",
    },
    {
      id: "bp_teeth",
      name: "Teeth",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "Teeth are hard, calcified structures used for biting and chewing food. Adults typically have 32 permanent teeth including incisors, canines, premolars, and molars.",
    },
    {
      id: "bp_neck",
      name: "Neck",
      image: "bpart_images/neck.png",
      organIds: ["larynx_trachea"],
      description:
        "The neck connects the head to the torso, housing the cervical spine, esophagus, trachea, and major blood vessels supplying the brain.",
    },
    {
      id: "bp_throat",
      name: "Throat",
      image: "bpart_images/esophagus.png",
      organIds: ["larynx_trachea"],
      description:
        "The throat (pharynx and larynx) is a passageway for both air and food. It connects the nasal cavity and mouth to the trachea and esophagus.",
    },
    {
      id: "bp_brain",
      name: "Brain",
      image: "bpart_images/brain.png",
      organIds: ["brain"],
      description:
        "The brain is the body's command center, controlling thoughts, memory, movement, and involuntary functions. It weighs about 3 pounds and contains approximately 86 billion neurons.",
    },
    {
      id: "bp_heart",
      name: "Heart",
      image: "bpart_images/heart.png",
      organIds: ["heart"],
      description:
        "The heart is a muscular organ that pumps blood throughout the body. It beats roughly 100,000 times per day, circulating oxygen and nutrients to every cell.",
    },
    {
      id: "bp_blood",
      name: "Blood",
      image: "bpart_images/bloodvessel.png",
      organIds: [],
      description:
        "Blood is a fluid connective tissue composed of red blood cells, white blood cells, platelets, and plasma. It transports oxygen, nutrients, hormones, and waste products throughout the body.",
    },
    {
      id: "bp_lungs",
      name: "Lungs",
      image: "bpart_images/lungs.png",
      organIds: ["lungs_right", "lungs_left"],
      description:
        "The lungs are paired organs responsible for gas exchange — taking in oxygen and expelling carbon dioxide. Together they hold about 6 liters of air at full capacity.",
    },
    {
      id: "bp_pancreas",
      name: "Pancreas",
      image: "bpart_images/pancreas.png",
      organIds: ["pancreas"],
      description:
        "The pancreas is a gland that produces digestive enzymes and hormones. It secretes insulin and glucagon to regulate blood sugar levels and digestive juices to break down food.",
    },
    {
      id: "bp_adrenal",
      name: "Adrenal Gland",
      image: "bpart_images/adrenal-gland.png",
      organIds: [],
      description:
        "The adrenal glands sit atop each kidney and produce hormones including adrenaline and cortisol. They regulate stress response, metabolism, blood pressure, and immune function.",
    },
    {
      id: "bp_parathyroid",
      name: "Parathyroid Gland",
      image: "bpart_images/parathyroid.png",
      organIds: [],
      description:
        "The four parathyroid glands regulate calcium levels in the blood by secreting parathyroid hormone (PTH). Calcium balance is essential for bone health, nerve function, and muscle contraction.",
    },
    {
      id: "bp_pituitary",
      name: "Pituitary Gland",
      image: "bpart_images/pituitary.png",
      organIds: [],
      description:
        "Often called the 'master gland,' the pituitary gland controls many other endocrine glands. It regulates growth, reproduction, blood pressure, and metabolism through hormone secretion.",
    },
    {
      id: "bp_thyroid",
      name: "Thyroid",
      image: "bpart_images/thyroid.png",
      organIds: ["thyroid"],
      description:
        "The thyroid gland produces hormones that regulate metabolism, heart rate, and body temperature. Located in the neck, it is essential for normal growth and development.",
    },
    {
      id: "bp_esophagus",
      name: "Esophagus",
      image: "bpart_images/esophagus.png",
      organIds: ["larynx_trachea"],
      description:
        "The esophagus is a muscular tube connecting the throat to the stomach. Muscular contractions (peristalsis) propel food downward, even allowing swallowing upside down.",
    },
    {
      id: "bp_abdomen",
      name: "Abdomen",
      image: "bpart_images/abdomen.png",
      organIds: [],
      description:
        "The abdomen is the body cavity between the chest and pelvis, containing the stomach, intestines, liver, kidneys, and other vital organs. It is bounded by the abdominal muscles.",
    },
    {
      id: "bp_stomach",
      name: "Stomach",
      image: "bpart_images/stomach.png",
      organIds: ["stomach"],
      description:
        "The stomach is a muscular sac that stores and begins digesting food. Gastric acid and enzymes break down proteins, and churning motion mixes food into a semi-liquid called chyme.",
    },
    {
      id: "bp_liver",
      name: "Liver",
      image: "bpart_images/liver.png",
      organIds: ["liver"],
      description:
        "The liver is the largest internal organ, performing over 500 functions including detoxifying the blood, producing bile for digestion, metabolizing nutrients, and synthesizing proteins.",
    },
    {
      id: "bp_intestines",
      name: "Intestines",
      image: "bpart_images/intestines.png",
      organIds: ["intestines"],
      description:
        "The intestines consist of the small and large intestine. The small intestine absorbs nutrients; the large intestine absorbs water and prepares waste for elimination.",
    },
    {
      id: "bp_gallbladder",
      name: "Gallbladder",
      image: "bpart_images/gallbladder.png",
      organIds: ["gallbladder"],
      description:
        "The gallbladder stores bile produced by the liver and releases it into the small intestine during digestion. Bile emulsifies fats to aid absorption.",
    },
    {
      id: "bp_colon",
      name: "Colon",
      image: "bpart_images/colon.png",
      organIds: ["intestines"],
      description:
        "The colon (large intestine) is approximately 5 feet long and absorbs water and electrolytes from indigestible food. Bacteria in the colon aid in fermentation and produce vitamins.",
    },
    {
      id: "bp_bladder",
      name: "Bladder",
      image: "bpart_images/bladder.png",
      organIds: ["bladder"],
      description:
        "The urinary bladder is a hollow muscular organ that stores urine produced by the kidneys. It can hold up to about 2 cups (500 ml) and signals the brain when it is time to urinate.",
    },
    {
      id: "bp_urethra",
      name: "Urethra",
      image: "bpart_images/urethra.png",
      organIds: [],
      description:
        "The urethra is the tube that carries urine from the bladder out of the body. In males it also carries semen; in females it is solely for urine elimination.",
    },
    {
      id: "bp_lymphnode",
      name: "Lymph Node",
      image: "bpart_images/lymphnode.png",
      organIds: [],
      description:
        "Lymph nodes are small, bean-shaped structures that filter lymph fluid and house immune cells. They swell during infections as the immune system mounts a response.",
    },
    {
      id: "bp_spleen",
      name: "Spleen",
      image: "bpart_images/spleen.png",
      organIds: ["spleen"],
      description:
        "The spleen filters blood, removes old red blood cells, and stores platelets. It plays an important role in the immune response, producing lymphocytes and antibodies.",
    },
    {
      id: "bp_appendix",
      name: "Appendix",
      image: "bpart_images/appendix.png",
      organIds: [],
      description:
        "The appendix is a finger-shaped pouch attached to the large intestine. Its exact function is debated; it may support gut bacteria and immune function. Appendicitis requires surgical removal.",
    },
    {
      id: "bp_muscles",
      name: "Muscles",
      image: "bpart_images/upperextremitymuscle.png",
      organIds: ["muscle"],
      description:
        "The body has over 600 muscles that enable movement, posture, and internal organ function. Skeletal muscles are voluntary; cardiac and smooth muscles are involuntary.",
    },
    {
      id: "bp_skin",
      name: "Skin & Tissue",
      image: "bpart_images/skin.png",
      organIds: [],
      description:
        "The skin is the body's largest organ, providing a protective barrier against the environment. It regulates temperature, prevents water loss, detects sensation, and synthesizes vitamin D.",
    },
    {
      id: "bp_bones",
      name: "Bones",
      image: "bpart_images/bonesjoints.png",
      organIds: ["knee_joint"],
      description:
        "The adult skeleton has 206 bones that provide structure, protect organs, enable movement, produce blood cells in the marrow, and store minerals like calcium and phosphorus.",
    },
    {
      id: "bp_joints",
      name: "Joints",
      image: "bpart_images/bonesjoints.png",
      organIds: ["knee_joint"],
      description:
        "Joints are connections between bones that allow movement and provide flexibility. They include cartilage, ligaments, and synovial fluid to absorb shock and reduce friction.",
    },
    {
      id: "bp_spine",
      name: "Spine",
      image: "bpart_images/spine.png",
      organIds: [],
      description:
        "The spine (vertebral column) consists of 33 vertebrae that protect the spinal cord, support the body's weight, and enable flexible movement. It forms the central axis of the skeleton.",
    },
    {
      id: "bp_back",
      name: "Back",
      image: "bpart_images/spine.png",
      organIds: [],
      description:
        "The back extends from the neck to the pelvis, comprising muscles, vertebrae, and connective tissue. It provides structural support, enables movement, and protects the spinal cord.",
    },
    {
      id: "bp_ankles",
      name: "Ankles",
      image: "bpart_images/ankle.png",
      organIds: [],
      description:
        "The ankle joint connects the leg to the foot, enabling dorsiflexion, plantarflexion, inversion, and eversion movements. It bears the full weight of the body during standing and walking.",
    },
    {
      id: "bp_arms",
      name: "Arms",
      image: "bpart_images/forearm.png",
      organIds: [],
      description:
        "The arms consist of the upper arm (humerus), forearm (radius and ulna), and hand. They provide strength and dexterity for lifting, carrying, pushing, and fine motor tasks.",
    },
    {
      id: "bp_chest",
      name: "Chest",
      image: "bpart_images/chest.png",
      organIds: [],
      description:
        "The chest (thorax) is the body region between the neck and abdomen, housing the heart, lungs, and major blood vessels. It is protected by the ribcage and sternum.",
    },
    {
      id: "bp_elbow",
      name: "Elbow",
      image: "bpart_images/elbow.png",
      organIds: [],
      description:
        "The elbow is a hinge joint connecting the upper and lower arm. It allows bending, straightening, and rotation of the forearm, essential for most arm movements.",
    },
    {
      id: "bp_feet",
      name: "Feet",
      image: "bpart_images/foot.png",
      organIds: [],
      description:
        "Each foot contains 26 bones, 33 joints, and over 100 muscles, tendons, and ligaments. The feet support body weight, absorb impact, and propel the body during movement.",
    },
    {
      id: "bp_hands",
      name: "Hands",
      image: "bpart_images/hand.png",
      organIds: [],
      description:
        "The hand has 27 bones and numerous muscles enabling precise grip and fine motor control. Human hands are uniquely adapted for tool use, complex tasks, and communication through gesture.",
    },
    {
      id: "bp_hips",
      name: "Hips",
      image: "bpart_images/pelvis.png",
      organIds: [],
      description:
        "The hip joint is a ball-and-socket joint connecting the femur to the pelvis. It bears body weight and enables walking, running, and a wide range of leg movements.",
    },
    {
      id: "bp_butt",
      name: "Butt",
      image: "bpart_images/pelvis.png",
      organIds: [],
      description:
        "The buttocks are formed by the gluteal muscles — the largest muscle group in the body. They provide power for walking, running, climbing, and maintaining posture.",
    },
    {
      id: "bp_anus",
      name: "Anus",
      image: "bpart_images/pelvis.png",
      organIds: [],
      description:
        "The anus is the opening at the end of the digestive tract through which solid waste is eliminated. It is controlled by internal and external sphincter muscles.",
    },
    {
      id: "bp_kidneys",
      name: "Kidneys",
      image: "bpart_images/kidneys.png",
      organIds: ["kidneys"],
      description:
        "The kidneys are bean-shaped organs that filter about 200 liters of blood daily, removing waste as urine. They also regulate blood pressure, electrolyte balance, and red blood cell production.",
    },
    {
      id: "bp_legs",
      name: "Legs",
      image: "bpart_images/legbone.png",
      organIds: [],
      description:
        "The legs consist of the thigh (femur), lower leg (tibia and fibula), and foot. They support body weight, enable locomotion, and are among the strongest structures in the body.",
    },
    {
      id: "bp_pelvis",
      name: "Pelvis",
      image: "bpart_images/pelvis.png",
      organIds: [],
      description:
        "The pelvis is a basin-shaped bony structure at the base of the spine that supports the abdominal organs, anchors the leg muscles, and in females forms the birth canal.",
    },
    {
      id: "bp_ribs",
      name: "Ribs",
      image: "bpart_images/ribs.png",
      organIds: [],
      description:
        "The 12 pairs of ribs form the ribcage, protecting the heart, lungs, and liver. They are connected to the sternum and spine, expanding and contracting with every breath.",
    },
    {
      id: "bp_shoulders",
      name: "Shoulders",
      image: "bpart_images/shoulder.png",
      organIds: [],
      description:
        "The shoulder is the most mobile joint in the body, enabling arm rotation in all directions. It includes the clavicle, scapula, and humerus, supported by the rotator cuff muscles.",
    },
    {
      id: "bp_breasts",
      name: "Breasts",
      image: "bpart_images/breastultra.png",
      organIds: [],
      description:
        "Breasts are glandular tissue structures on the chest that produce milk for infant feeding. They consist of lobules, ducts, fatty tissue, and are monitored for changes in health.",
    },
    {
      id: "bp_mammary",
      name: "Mammary Glands",
      image: "bpart_images/mammary.png",
      organIds: [],
      description:
        "Mammary glands are specialized milk-producing glands located in the breasts. They are activated by hormonal changes during pregnancy and lactation to produce breast milk.",
    },
    {
      id: "bp_uterus",
      name: "Uterus",
      image: "bpart_images/uterus.png",
      organIds: ["female_reproductive"],
      description:
        "The uterus is a hollow muscular organ where a fertilized egg implants and a fetus develops. Its inner lining (endometrium) sheds during menstruation when pregnancy does not occur.",
    },
    {
      id: "bp_penis",
      name: "Penis",
      image: "bpart_images/malerepro.png",
      organIds: ["male_reproductive"],
      description:
        "The penis is the male external reproductive and urinary organ. It contains the urethra for urine and semen passage and becomes erect during sexual arousal to enable intercourse.",
    },
    {
      id: "bp_prostate",
      name: "Prostate",
      image: "bpart_images/prostate.png",
      organIds: ["male_reproductive"],
      description:
        "The prostate is a walnut-sized gland in males that produces fluid nourishing and protecting sperm. It surrounds the urethra below the bladder and tends to enlarge with age.",
    },
    {
      id: "bp_testicles",
      name: "Testicles",
      image: "bpart_images/malerepro.png",
      organIds: ["male_reproductive"],
      description:
        "The testicles are male reproductive glands that produce sperm and the hormone testosterone. They are housed in the scrotum, which maintains a temperature slightly lower than body temperature.",
    },
    {
      id: "bp_blood_vessels",
      name: "Blood Vessels",
      image: "bpart_images/bloodvessel.png",
      organIds: [],
      description:
        "Blood vessels are the network of arteries, veins, and capillaries that carry blood throughout the body. They deliver oxygen and nutrients to tissues and return waste products for elimination.",
    },
    {
      id: "bp_cartilage",
      name: "Cartilage",
      image: "bpart_images/bonesjoints.png",
      organIds: [],
      description:
        "Cartilage is a flexible connective tissue found in joints, the ear, nose, and between vertebrae. It provides cushioning, reduces friction, and supports structural shape without the rigidity of bone.",
    },
    {
      id: "bp_digestive_tract",
      name: "Digestive Tract",
      image: "bpart_images/intestines.png",
      organIds: [],
      description:
        "The digestive tract is the continuous tube from mouth to anus that processes food. It includes the esophagus, stomach, small intestine, and large intestine, breaking down nutrients for absorption.",
    },
    {
      id: "bp_fallopian_tubes",
      name: "Fallopian Tubes",
      image: "bpart_images/uterus.png",
      organIds: [],
      description:
        "The fallopian tubes are paired structures connecting the ovaries to the uterus. They transport eggs from the ovaries and are typically where fertilization occurs.",
    },
    {
      id: "bp_fingers",
      name: "Fingers",
      image: "bpart_images/hand.png",
      organIds: [],
      description:
        "The fingers are the digits of the hand, each containing three phalanges (except the thumb with two). They enable fine motor skills, grip, touch sensation, and intricate manipulation of objects.",
    },
    {
      id: "bp_groin",
      name: "Groin",
      image: "bpart_images/pelvis.png",
      organIds: [],
      description:
        "The groin is the area where the abdomen meets the upper thigh. It contains the inguinal canal, lymph nodes, and major blood vessels, and is a common site for hernias and muscle strains.",
    },
    {
      id: "bp_hair",
      name: "Hair",
      image: "bpart_images/head.png",
      organIds: [],
      description:
        "Hair is a protein filament growing from follicles in the skin. It provides insulation, UV protection, and sensory input. Hair growth cycles through active growth, regression, and resting phases.",
    },
    {
      id: "bp_knee",
      name: "Knee",
      image: "bpart_images/bonesjoints.png",
      organIds: [],
      description:
        "The knee is the largest joint in the body, connecting the femur to the tibia. It contains cartilage, ligaments (ACL, MCL, PCL, LCL), and menisci that enable bending, straightening, and weight-bearing.",
    },
    {
      id: "bp_larynx",
      name: "Larynx",
      image: "bpart_images/neck.png",
      organIds: [],
      description:
        "The larynx (voice box) is a cartilaginous structure in the throat that houses the vocal cords. It produces sound for speech, protects the airway during swallowing, and regulates airflow to the lungs.",
    },
    {
      id: "bp_lips",
      name: "Lips",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "The lips are muscular folds surrounding the mouth opening. They assist in speech, eating, facial expression, and sensory perception. Their thin skin and rich blood supply give them their characteristic color.",
    },
    {
      id: "bp_nails",
      name: "Nails",
      image: "bpart_images/hand.png",
      organIds: [],
      description:
        "Nails are hard keratin plates covering the tips of fingers and toes. They protect the sensitive nail bed, aid in fine manipulation, and can indicate systemic health through changes in color or texture.",
    },
    {
      id: "bp_sinuses",
      name: "Sinuses",
      image: "bpart_images/nose.png",
      organIds: [],
      description:
        "The paranasal sinuses are air-filled cavities in the skull bones surrounding the nose. They lighten the skull, produce mucus, warm and humidify inhaled air, and contribute to voice resonance.",
    },
    {
      id: "bp_nerves",
      name: "Nerves",
      image: "bpart_images/brain.png",
      organIds: [],
      description:
        "Nerves are bundles of fibers that transmit electrical signals between the brain, spinal cord, and body. They control movement, sensation, and autonomic functions like heart rate and digestion.",
    },
    {
      id: "bp_ovaries",
      name: "Ovaries",
      image: "bpart_images/uterus.png",
      organIds: [],
      description:
        "The ovaries are paired female reproductive glands that produce eggs (ova) and hormones including estrogen and progesterone. They regulate the menstrual cycle and play a key role in fertility.",
    },
    {
      id: "bp_rectum",
      name: "Rectum",
      image: "bpart_images/colon.png",
      organIds: [],
      description:
        "The rectum is the final section of the large intestine, connecting the sigmoid colon to the anus. It stores stool before elimination and contains stretch receptors that signal the urge to defecate.",
    },
    {
      id: "bp_respiratory_tract",
      name: "Respiratory Tract",
      image: "bpart_images/lungs.png",
      organIds: [],
      description:
        "The respiratory tract is the system of airways from the nose to the lungs. It filters, warms, and humidifies air, and facilitates gas exchange — delivering oxygen and removing carbon dioxide.",
    },
    {
      id: "bp_salivary_glands",
      name: "Salivary Glands",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "The salivary glands produce saliva, which moistens food for swallowing, begins starch digestion, and protects teeth from decay. The three major pairs are the parotid, submandibular, and sublingual glands.",
    },
    {
      id: "bp_scalp",
      name: "Scalp",
      image: "bpart_images/head.png",
      organIds: [],
      description:
        "The scalp is the skin covering the top of the head. It is richly vascularized, contains numerous hair follicles, and consists of five tissue layers that protect the skull and brain beneath.",
    },
    {
      id: "bp_skull",
      name: "Skull",
      image: "bpart_images/skull.png",
      organIds: [],
      description:
        "The skull is the bony structure forming the head, composed of 22 bones. The cranium protects the brain while the facial bones support the eyes, nose, and mouth and anchor the muscles of facial expression.",
    },
    {
      id: "bp_tendons",
      name: "Tendons",
      image: "bpart_images/upperextremitymuscle.png",
      organIds: [],
      description:
        "Tendons are tough, fibrous bands of connective tissue that attach muscles to bones. They transmit the force of muscle contraction to produce movement and can withstand significant tension.",
    },
    {
      id: "bp_thigh",
      name: "Thigh",
      image: "bpart_images/femur.png",
      organIds: [],
      description:
        "The thigh is the upper portion of the leg between the hip and knee. It contains the femur (the body's longest bone) and powerful muscle groups including the quadriceps, hamstrings, and adductors.",
    },
    {
      id: "bp_thymus",
      name: "Thymus",
      image: "bpart_images/chest.png",
      organIds: ["thymus"],
      description:
        "The thymus is a small gland located behind the sternum. It is essential for developing the immune system, producing T-cells during childhood. It gradually shrinks after puberty.",
    },
    {
      id: "bp_toes",
      name: "Toes",
      image: "bpart_images/foot.png",
      organIds: [],
      description:
        "The toes are the digits of the foot, providing balance and propulsion during walking and running. Each toe (except the big toe) has three phalanges connected by joints.",
    },
    {
      id: "bp_tongue",
      name: "Tongue",
      image: "bpart_images/mouthteethgums.png",
      organIds: [],
      description:
        "The tongue is a muscular organ in the mouth essential for tasting, chewing, swallowing, and speech. It is covered with taste buds that detect sweet, sour, salty, bitter, and umami flavors.",
    },
    {
      id: "bp_tonsils",
      name: "Tonsils",
      image: "bpart_images/neck.png",
      organIds: [],
      description:
        "The tonsils are lymphoid tissue masses at the back of the throat. They serve as a first line of immune defense, trapping pathogens entering through the mouth and nose.",
    },
    {
      id: "bp_urinary_tract",
      name: "Urinary Tract",
      image: "bpart_images/urinarytract.png",
      organIds: [],
      description:
        "The urinary tract is the drainage system for urine, consisting of the kidneys, ureters, bladder, and urethra. It filters blood, removes waste, regulates fluid balance, and eliminates urine.",
    },
    {
      id: "bp_vagina",
      name: "Vagina",
      image: "bpart_images/uterus.png",
      organIds: [],
      description:
        "The vagina is a muscular canal extending from the vulva to the cervix. It serves as the birth canal, receives the penis during intercourse, and provides an outlet for menstrual flow.",
    },
    {
      id: "bp_vulva",
      name: "Vulva",
      image: "bpart_images/uterus.png",
      organIds: [],
      description:
        "The vulva encompasses the external female genitalia, including the labia majora, labia minora, clitoris, and vaginal opening. It protects the internal reproductive organs and provides sensory function.",
    },
    {
      id: "bp_white_blood_cells",
      name: "White Blood Cells",
      image: "bpart_images/circulatory.png",
      organIds: [],
      description:
        "White blood cells (leukocytes) are immune system cells that defend against infection and disease. Types include neutrophils, lymphocytes, monocytes, eosinophils, and basophils, each with specialized roles.",
    },
  ];

  // --- Body Parts nav state ---
  const selectedBodyParts = new Set(); // tracks nav-selected body part IDs
  const systemSelectedBodyParts = new Set(); // tracks body parts auto-added by system click
  let isBodyPartsNavSorted = false;

  // Disable/enable section hit areas based on whether body parts are selected
  function updateSectionHitAreaState() {
    const frontLayer = document.getElementById("sections-layer");
    const backLayer = document.getElementById("back-sections-layer");
    const shouldDisable =
      selectedBodyParts.size > 0 && currentView === "sections";
    if (frontLayer)
      frontLayer.classList.toggle("sections-disabled", shouldDisable);
    if (backLayer)
      backLayer.classList.toggle("sections-disabled", shouldDisable);
  }

  // Add click handler to a bp-highlight-ellipse so clicking it deselects
  function makeEllipseClickable(ellipse, bpId) {
    ellipse.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleBodyPart(bpId);
    });
  }

  function getBodyPartIdsForOrgan(organId) {
    return BODY_PARTS_DATA.filter((bp) => bp.organIds.includes(organId)).map(
      (bp) => bp.id,
    );
  }

  function syncBodyPartsFromOrgan(organId, isSelected) {
    const mappedBodyPartIds = getBodyPartIdsForOrgan(organId);
    if (!mappedBodyPartIds.length) return;

    if (isSelected) {
      mappedBodyPartIds.forEach((bpId) => selectedBodyParts.add(bpId));
    } else {
      mappedBodyPartIds.forEach((bpId) => {
        const bp = BODY_PARTS_DATA.find((item) => item.id === bpId);
        if (!bp) return;
        const stillMappedToSelectedOrgan = bp.organIds.some((oid) =>
          selectedOrgans.has(oid),
        );
        if (!stillMappedToSelectedOrgan) selectedBodyParts.delete(bpId);
      });
    }

    renderBodyPartsNavPanel();
    renderBodyPartCards();
  }

  // --- Render Body Parts nav list ---
  function renderBodyPartsNavPanel() {
    const listEl = document.getElementById("bodyPartsNavList");
    const bodyPartsForView = isBodyPartsNavSorted
      ? [...BODY_PARTS_DATA].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          }),
        )
      : BODY_PARTS_DATA;

    listEl.innerHTML = bodyPartsForView
      .map(
        (bp) => `
            <li class="body-parts-nav-item ${selectedBodyParts.has(bp.id) ? "active" : ""}" data-bp-id="${bp.id}" onclick="toggleBodyPart('${bp.id}')">
              <img class="body-parts-nav-icon" src="${bp.image}" alt="${bp.name}" onerror="this.style.display='none'" />
              <span class="body-parts-nav-name">${bp.name}</span>
            </li>
          `,
      )
      .join("");
  }

  window.toggleBodyPartsSort = function (event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    isBodyPartsNavSorted = !isBodyPartsNavSorted;
    const sortBtn = document.getElementById("bodyPartsSortToggle");
    if (sortBtn) {
      sortBtn.classList.toggle("active", isBodyPartsNavSorted);
      sortBtn.setAttribute("aria-pressed", String(isBodyPartsNavSorted));
    }
    renderBodyPartsNavPanel();
  };

  // --- Toggle a body part from the nav panel ---
  window.toggleBodyPart = function (bpId) {
    const bp = BODY_PARTS_DATA.find((b) => b.id === bpId);
    if (!bp) return;

    // Organs2 mode: open symptom modal instead of toggling body part cards
    if (currentView === "organs2") {
      const organ2Key = BP_TO_ORGAN2_KEY[bpId];
      if (!organ2Key) return;
      const displayName = bp.name;
      const hasOrganInModel = bp.organIds.length > 0;

      // Clear any previous highlight
      clearOrgan2Highlight();

      if (hasOrganInModel) {
        // Highlight the first organ in the model while modal is open
        const firstOrganId = bp.organIds[0];
        const organGroup = document.getElementById("group-" + firstOrganId);
        if (organGroup) {
          organGroup.classList.add("selected");
          organ2HighlightedGroup = organGroup;

          const rect = organGroup.getBoundingClientRect();
          const fakeEvent = {
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
          };
          openOrgan2Modal(organ2Key, displayName, fakeEvent);
        }
      } else {
        // Non-organ body part: use approximate SVG coordinates
        const coords = BODY_PART_SVG_COORDS[organ2Key];
        if (coords) {
          const screenCoords = svgCoordsToScreen(coords.x, coords.y);
          openOrgan2Modal(organ2Key, displayName, screenCoords);
        } else {
          // Fallback: center of viewport
          openOrgan2Modal(organ2Key, displayName, {
            clientX: window.innerWidth / 2,
            clientY: window.innerHeight / 2,
          });
        }
      }
      return;
    }

    // Sections mode: highlight body part regions on the body silhouette
    if (currentView === "sections") {
      const bpLayer = document.getElementById("bp-highlight-layer");
      const regionData = BODY_PART_HIGHLIGHT_REGIONS[bpId];

      if (selectedBodyParts.has(bpId)) {
        selectedBodyParts.delete(bpId);
        systemSelectedBodyParts.delete(bpId);
        // Remove highlight ellipses for this body part
        bpLayer
          .querySelectorAll(`[data-bp-id="${bpId}"]`)
          .forEach((el) => el.remove());
      } else {
        selectedBodyParts.add(bpId);
        if (regionData) {
          const regions = Array.isArray(regionData) ? regionData : [regionData];
          regions.forEach((r, i) => {
            const ellipse = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "ellipse",
            );
            ellipse.setAttribute("cx", r.cx);
            ellipse.setAttribute("cy", r.cy);
            ellipse.setAttribute("rx", r.rx);
            ellipse.setAttribute("ry", r.ry);
            ellipse.setAttribute("class", "bp-highlight-ellipse");
            ellipse.setAttribute("data-bp-id", bpId);
            makeEllipseClickable(ellipse, bpId);
            bpLayer.appendChild(ellipse);
          });
        }
      }

      const li = document.querySelector(
        `.body-parts-nav-item[data-bp-id="${bpId}"]`,
      );
      if (li) li.classList.toggle("active", selectedBodyParts.has(bpId));

      updateSectionHitAreaState();
      renderBodyPartCards();
      renderSelectedList();
      return;
    }

    if (selectedBodyParts.has(bpId)) {
      selectedBodyParts.delete(bpId);
      systemSelectedBodyParts.delete(bpId);
    } else {
      selectedBodyParts.add(bpId);
    }

    // Sync nav item active state
    const li = document.querySelector(
      `.body-parts-nav-item[data-bp-id="${bpId}"]`,
    );
    if (li) li.classList.toggle("active", selectedBodyParts.has(bpId));

    renderBodyPartCards();
    renderSelectedList();
  };

  // --- Render body part cards as 2-per-row grid ---
  function renderBodyPartCards() {
    var container = document.getElementById("bodyPartCardsContainer");
    var existingIds = new Set();
    container.querySelectorAll(".body-part-card").forEach(function (card) {
      var id = card.getAttribute("data-bp-id");
      if (selectedBodyParts.has(id)) {
        existingIds.add(id);
      } else {
        card.remove();
      }
    });
    [...selectedBodyParts].forEach(function (bpId) {
      if (existingIds.has(bpId)) return;
      var bp = BODY_PARTS_DATA.find(function (b) {
        return b.id === bpId;
      });
      if (!bp) return;
      var card = document.createElement("div");
      card.className = "body-part-card";
      card.setAttribute("data-bp-id", bp.id);
      card.style.animation = "dropDownJerk 0.45s ease-out both";
      card.innerHTML =
        '<button class="body-part-card-close" onclick="toggleBodyPart(\'' +
        bp.id +
        "')\">&times;</button>" +
        '<h4 class="body-part-card-title">' +
        bp.name +
        "</h4>" +
        '<img class="body-part-card-image" src="' +
        bp.image +
        '" alt="' +
        bp.name +
        '" />' +
        '<p class="body-part-card-desc">' +
        bp.description +
        "</p>";
      container.appendChild(card);
    });
    renderSpanningSections();
  }

  // Disease and Symptom spanning sections
  var DISEASES_BY_BP = window.DISEASES_BY_BODY_PART || {};
  var SYMPTOMS_BY_BP = window.SYMPTOMS_BY_BODY_PART || {};
  var diseaseSearchTimer = null;
  var symptomSectionSearchTimer = null;
  var diseaseSearchFirstKeystroke = true;
  var symptomSectionSearchFirstKeystroke = true;
  var GLOBAL_SEARCH_MAX_RESULTS = 300;
  var ALL_DISEASES = buildGlobalDiseasesPool();
  var ALL_SYMPTOMS = buildGlobalSymptomsPool();

  function buildGlobalDiseasesPool() {
    var seen = {};
    var result = [];
    Object.keys(DISEASES_BY_BP).forEach(function (bpId) {
      var diseases = DISEASES_BY_BP[bpId];
      if (!Array.isArray(diseases)) return;
      for (var i = 0; i < diseases.length; i++) {
        var d = diseases[i];
        if (!d || !d.name) continue;
        var key = (d.name || "") + "::" + (d.code || "");
        if (seen[key]) continue;
        seen[key] = true;
        result.push({ name: d.name, code: d.code || "" });
      }
    });
    result.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
    });
    return result;
  }

  function buildGlobalSymptomsPool() {
    if (Array.isArray(FULL_SYMPTOMS) && FULL_SYMPTOMS.length > 0) {
      return FULL_SYMPTOMS.slice();
    }
    var seen = {};
    var result = [];
    Object.keys(SYMPTOMS_BY_BP).forEach(function (bpId) {
      var symptoms = SYMPTOMS_BY_BP[bpId];
      if (!Array.isArray(symptoms)) return;
      for (var i = 0; i < symptoms.length; i++) {
        var s = symptoms[i];
        if (!s || seen[s]) continue;
        seen[s] = true;
        result.push(s);
      }
    });
    result.sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
    return result;
  }

  function filterGlobalDiseases(query) {
    var lowerQuery = query.toLowerCase();
    var results = [];
    for (var i = 0; i < ALL_DISEASES.length; i++) {
      var disease = ALL_DISEASES[i];
      if (
        disease.name.toLowerCase().indexOf(lowerQuery) !== -1 ||
        disease.code.toLowerCase().indexOf(lowerQuery) !== -1
      ) {
        results.push(disease);
        if (results.length >= GLOBAL_SEARCH_MAX_RESULTS) break;
      }
    }
    return results;
  }

  function filterGlobalSymptoms(query) {
    var lowerQuery = query.toLowerCase();
    var results = [];
    for (var i = 0; i < ALL_SYMPTOMS.length; i++) {
      if (ALL_SYMPTOMS[i].toLowerCase().indexOf(lowerQuery) !== -1) {
        results.push(ALL_SYMPTOMS[i]);
        if (results.length >= GLOBAL_SEARCH_MAX_RESULTS) break;
      }
    }
    return results;
  }

  function renderColumnSearchSkeleton(listEl) {
    listEl.textContent = "";
    var widths = [
      "long",
      "medium",
      "short",
      "long",
      "medium",
      "short",
      "medium",
    ];
    widths.forEach(function (w) {
      var li = document.createElement("li");
      li.className = "symptom-skeleton-item";
      var bar = document.createElement("div");
      bar.className = "symptom-skeleton-bar " + w;
      li.appendChild(bar);
      listEl.appendChild(li);
    });
  }

  window.toggleSectionCollapse = function (sectionId) {
    var section = document.getElementById(sectionId);
    if (section) section.classList.toggle("collapsed");
  };

  var spanningAnimTimers = [];
  var spanningSectionsShown = false;

  function renderSpanningSections() {
    var container = document.getElementById("spanningSections");
    var symptomSec = document.getElementById("symptomSection");
    var diseaseSec = document.getElementById("diseaseSection");

    if (selectedBodyParts.size === 0) {
      container.classList.remove("visible");
      spanningAnimTimers.forEach(function (t) {
        clearTimeout(t);
      });
      spanningAnimTimers = [];
      spanningSectionsShown = false;
      symptomSec.style.animation = "";
      symptomSec.style.opacity = "";
      symptomSec.classList.remove("collapsed");
      diseaseSec.style.animation = "";
      diseaseSec.style.opacity = "";
      diseaseSec.classList.remove("collapsed");
      return;
    }

    var isFirstShow = !spanningSectionsShown;
    container.classList.add("visible");
    spanningSectionsShown = true;

    clearTimeout(diseaseSearchTimer);
    clearTimeout(symptomSectionSearchTimer);
    diseaseSearchFirstKeystroke = true;
    symptomSectionSearchFirstKeystroke = true;
    document.getElementById("diseaseSearchInput").value = "";
    document.getElementById("symptomSectionSearchInput").value = "";
    renderDiseaseList();
    renderSymptomSectionList();

    if (isFirstShow) {
      symptomSec.classList.add("collapsed");
      diseaseSec.classList.add("collapsed");
      symptomSec.style.animation = "dropDownJerk 0.45s ease-out both";
      symptomSec.style.opacity = "";
      diseaseSec.style.animation = "dropDownJerk 0.45s ease-out both";
      diseaseSec.style.opacity = "";
      spanningAnimTimers.forEach(function (t) {
        clearTimeout(t);
      });
      spanningAnimTimers = [];
    }
  }

  function getDiseasesForSelection() {
    var seen = {};
    var result = [];
    selectedBodyParts.forEach(function (bpId) {
      var diseases = DISEASES_BY_BP[bpId];
      if (diseases) {
        for (var i = 0; i < diseases.length; i++) {
          var d = diseases[i];
          if (!seen[d.name]) {
            seen[d.name] = true;
            result.push(d);
          }
        }
      }
    });
    result.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
    });
    return result;
  }

  function getSymptomsForSelection() {
    var seen = {};
    var result = [];
    selectedBodyParts.forEach(function (bpId) {
      var symptoms = SYMPTOMS_BY_BP[bpId];
      if (symptoms) {
        for (var i = 0; i < symptoms.length; i++) {
          var s = symptoms[i];
          if (!seen[s]) {
            seen[s] = true;
            result.push(s);
          }
        }
      }
    });
    result.sort(function (a, b) {
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    });
    return result;
  }

  function renderDiseaseList(filterQuery) {
    var isSearchMode = !!filterQuery;
    var diseases = isSearchMode
      ? filterGlobalDiseases(filterQuery)
      : getDiseasesForSelection();
    document.getElementById("diseaseCount").textContent = diseases.length;
    var listEl = document.getElementById("diseaseList");
    var BATCH_SIZE = 200;
    var toRender = isSearchMode ? diseases : diseases.slice(0, BATCH_SIZE);
    var fragment = document.createDocumentFragment();

    if (diseases.length === 0) {
      var emptyLi = document.createElement("li");
      emptyLi.className = "disease-list-empty";
      emptyLi.textContent = filterQuery
        ? "No matching diseases"
        : "No disease data for selected body parts";
      fragment.appendChild(emptyLi);
    } else {
      for (var i = 0; i < toRender.length; i++) {
        var li = document.createElement("li");
        li.textContent = toRender[i].name;
        li.title = toRender[i].code;
        fragment.appendChild(li);
      }
      if (!isSearchMode && diseases.length > BATCH_SIZE) {
        var moreLi = document.createElement("li");
        moreLi.className = "show-more-item";
        var remaining = diseases.length - BATCH_SIZE;
        moreLi.textContent = "+ " + remaining + " more diseases...";
        moreLi.addEventListener("click", function () {
          var remainFrag = document.createDocumentFragment();
          for (var j = BATCH_SIZE; j < diseases.length; j++) {
            var rli = document.createElement("li");
            rli.textContent = diseases[j].name;
            rli.title = diseases[j].code;
            remainFrag.appendChild(rli);
          }
          moreLi.remove();
          listEl.appendChild(remainFrag);
        });
        fragment.appendChild(moreLi);
      }
    }

    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    listEl.appendChild(fragment);
  }

  function renderSymptomSectionList(filterQuery) {
    var isSearchMode = !!filterQuery;
    var symptoms = isSearchMode
      ? filterGlobalSymptoms(filterQuery)
      : getSymptomsForSelection();
    document.getElementById("symptomCount").textContent = symptoms.length;
    var listEl = document.getElementById("symptomSectionList");
    var fragment = document.createDocumentFragment();

    if (symptoms.length === 0) {
      var emptyLi = document.createElement("li");
      emptyLi.className = "symptom-list-empty";
      emptyLi.textContent = filterQuery
        ? "No matching symptoms"
        : "No symptom data for selected body parts";
      fragment.appendChild(emptyLi);
    } else {
      for (var i = 0; i < symptoms.length; i++) {
        var li = document.createElement("li");
        li.textContent = symptoms[i];
        fragment.appendChild(li);
      }
    }

    while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
    listEl.appendChild(fragment);
  }

  document
    .getElementById("diseaseSearchInput")
    .addEventListener("input", function () {
      var q = this.value.trim();
      if (q.length === 0) {
        diseaseSearchFirstKeystroke = true;
        clearTimeout(diseaseSearchTimer);
        renderDiseaseList();
        return;
      }
      if (diseaseSearchFirstKeystroke) {
        diseaseSearchFirstKeystroke = false;
        renderColumnSearchSkeleton(document.getElementById("diseaseList"));
        clearTimeout(diseaseSearchTimer);
        diseaseSearchTimer = setTimeout(function () {
          var currentQ = document
            .getElementById("diseaseSearchInput")
            .value.trim();
          if (currentQ.length === 0) return;
          renderDiseaseList(currentQ);
        }, 1000);
        return;
      }
      clearTimeout(diseaseSearchTimer);
      diseaseSearchTimer = setTimeout(function () {
        var currentQ = document
          .getElementById("diseaseSearchInput")
          .value.trim();
        if (currentQ.length === 0) return;
        renderDiseaseList(currentQ);
      }, 250);
    });
  document
    .getElementById("symptomSectionSearchInput")
    .addEventListener("input", function () {
      var q = this.value.trim();
      if (q.length === 0) {
        symptomSectionSearchFirstKeystroke = true;
        clearTimeout(symptomSectionSearchTimer);
        renderSymptomSectionList();
        return;
      }
      if (symptomSectionSearchFirstKeystroke) {
        symptomSectionSearchFirstKeystroke = false;
        renderColumnSearchSkeleton(
          document.getElementById("symptomSectionList"),
        );
        clearTimeout(symptomSectionSearchTimer);
        symptomSectionSearchTimer = setTimeout(function () {
          var currentQ = document
            .getElementById("symptomSectionSearchInput")
            .value.trim();
          if (currentQ.length === 0) return;
          renderSymptomSectionList(currentQ);
        }, 1000);
        return;
      }
      clearTimeout(symptomSectionSearchTimer);
      symptomSectionSearchTimer = setTimeout(function () {
        var currentQ = document
          .getElementById("symptomSectionSearchInput")
          .value.trim();
        if (currentQ.length === 0) return;
        renderSymptomSectionList(currentQ);
      }, 250);
    });

  renderBodyPartsNavPanel();
  renderBodyPartCards();

  // Set default view to Body Sections on page load
  setView("sections");

  // Reveal the app only after the initial UI is ready.
  requestAnimationFrame(function () {
    document.body.classList.remove("app-booting");
  });
})();
