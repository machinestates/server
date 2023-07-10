const { createSpeechFromText } = require('../shared/polly');

void async function() {
  const text = `
EASE was a skilled trader navigating the volatile world of cryptocurrency. On the first day, EASE sold 50 CACHE, making a profit of $4550. Eager to explore new opportunities, EASE arrived at the virtual world of VYPR.

In VYPR, EASE purchased 12 KAIOTE tokens at $368 each, investing $4416. EASE then traveled to PLASMANET, where an unforeseen event occurred. Strapped for funds, EASE borrowed $13345 but quickly used it to acquire 11 SPECTR coins at $1169 per coin, spending a total of $12859.

Returning to VYPR, EASE made a fantastic trade, selling 11 SPECTR tokens for a hefty profit of $35563. EASE also sold the 12 KAIOTE tokens, earning $12852. However, the joy was short-lived as EASE became a target of a hacking incident, resulting in a loss of $4904.

Undeterred, EASE pressed on and arrived back at PLASMANET. Despite losing $2583 due to another hacking occurrence, EASE seized an opportunity and sold 100 PSYONIC coins for a remarkable $49100.

EASE then travelled to PLASMANET again, where $29282 was promptly paid towards the debt. Needing more capital, EASE borrowed $25000 and invested in 4 HASHCOIN tokens at $15760 each, spending a total of $63040.

Next, EASE journeyed to VYPR and PLASMANET before making a significant sale. The 4 HASHCOIN tokens were sold for a staggering $83568, resulting in a considerable profit. EASE then made additional trips to FEDERAL COIN SERVICE and PLASMANET, diligently reducing the debt with payments totaling $44289.

EASE's final trading action occurred in PLASMANET, where 100 PSYONIC coins were bought for $385 each, amounting to $38500. The journey ended in CHARLOTTESWEB, where the 100 PSYONIC coins were sold for $468 each, generating $46800.

Completing the round with a final score of $52605, EASE had successfully navigated through the ups and downs, proving their trading expertise.
`;

  const params = {
    Engine: 'neural',
    OutputFormat: "mp3",
    OutputS3BucketName: "machine-states-audio",
    Text: text,
    TextType: "text",
    VoiceId: "Joanna",
    SampleRate: "22050"
  };

  try {
    const response = await createSpeechFromText(text);
    console.log(response);
  } catch (err) {
    console.log("Error putting object", err);
  }
}();
