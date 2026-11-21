export const COPY = {
  product: "FreshLoop",
  uvp: "Know what to cook before your groceries go to waste.",
  safety:
    "Dates you enter are reminders. FreshLoop does not decide whether food is safe.",
  safetyLong:
    "A best-before date, a use-by date, or an opened-on date is stored exactly as you type it. FreshLoop does not compare it with a shelf-life table and does not tell you to keep or discard food.",
  dietDisclaimer:
    "Filters compare your choices with ingredients listed on each sample recipe, including optional ingredients. They do not check cross-contact, and they are not an allergen or medical judgment.",
  staplesNote:
    "Salt, pepper, and water are left off the list when this is on. Olive oil and other ingredients are included unless they are in the pantry.",
  reminderLimit:
    "Reminders in this prototype appear while the page is open. FreshLoop cannot notify you after you close it.",
  barcodeConfirm:
    "Check this result before saving. A barcode match is not in your pantry until you save it.",
  barcodeMiss:
    "No sample product uses that code. Nothing was added. This prototype has no grocery database.",
  receiptUnavailable:
    "Receipt scanning is not connected. There is no OCR provider in this prototype. Add each item yourself.",
  quantityHonesty:
    "FreshLoop subtracts only amounts it can confirm. A different unit, or a blank quantity, stays on the shopping list.",
  sampleBanner: "Sample kitchen. These items are fictional.",
  offline:
    "You are offline. The pantry stays on this device. Recipe search uses the sample catalog stored in the app.",
  sourceNote:
    "Original sample recipe written for this prototype. It is not from a licensed recipe service.",
  fsisUrl:
    "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/food-product-dating",
  foodKeeperUrl: "https://www.foodsafety.gov/keep-food-safe/foodkeeper-app",
} as const;

const VERDICT_PHRASES = [
  "safe to eat",
  "unsafe to eat",
  "throw it away",
  "throw it out",
  "guaranteed fresh",
  "allergen-free",
  "certified safe",
  "still good to eat",
];

export function hasSafetyVerdict(text: string): boolean {
  const lower = text.toLowerCase();
  return VERDICT_PHRASES.some((phrase) => lower.includes(phrase));
}
