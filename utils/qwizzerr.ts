import { usaStates } from "@constants/usa-states";
import { euroCountries } from "@constants/euro-countries";

const MAX_Q = 10;

function sortData() {
  const usaSorted = usaStates.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  usaSorted.forEach((usa) => usa.length === 2 && usa.push("🇺🇸"));

  const euSorted = euroCountries.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  euSorted.forEach((eu) => eu.length === 2 && eu.push("🇪🇺"));

  const usaEuMerged = [...usaSorted, ...euSorted];

  const usaEuSorted = usaEuMerged.sort(
    (a, b) => (a[1] as number) - (b[1] as number)
  );
  return usaEuSorted;
}

function findSmaller(
  usaEuSorted: (string | number)[][],
  index: number,
  flag: "🇺🇸" | "🇪🇺"
): null | [string, number, "🇺🇸" | "🇪🇺"] {
  if (index < 1) {
    return null;
  } else if (usaEuSorted[index - 1][2] !== flag) {
    return usaEuSorted[index - 1] as [string, number, "🇺🇸" | "🇪🇺"];
  } else {
    return findSmaller(usaEuSorted, index - 1, flag);
  }
}

function findLarger(
  usaEuSorted: (string | number)[][],
  index: number,
  flag: "🇺🇸" | "🇪🇺"
): null | [string, number, "🇺🇸" | "🇪🇺"] {
  if (index >= usaEuSorted.length - 1) {
    return null;
  } else if (usaEuSorted[index + 1][2] !== flag) {
    return usaEuSorted[index + 1] as [string, number, "🇺🇸" | "🇪🇺"];
  } else {
    return findLarger(usaEuSorted, index + 1, flag);
  }
}

export default function createQuestions() {
  const usaEuSorted = sortData();
  const qashes = new Set();
  const qArray = new Array<Array<string>>();
  const answers = new Array<string>();
  let i = 0;
  while (qArray.length < MAX_Q && i < usaEuSorted.length) {
    const rando = Math.floor(Math.random() * usaEuSorted.length);
    const smaller = findSmaller(
      usaEuSorted,
      rando,
      usaEuSorted[rando][2] as "🇺🇸" | "🇪🇺"
    );
    const larger = findLarger(
      usaEuSorted,
      rando,
      usaEuSorted[rando][2] as "🇺🇸" | "🇪🇺"
    );
    if (smaller && larger) {
      const flag = usaEuSorted[rando][2];
      const q = `Which ${
        flag === "🇺🇸" ? " 🇪🇺 European country" : " 🇺🇸 US State (or Territory)"
      } is closest in size (either larger or smaller) to ${
        usaEuSorted[rando][0]
      }?`;
      const a = `${larger[0]} is  ${new Intl.NumberFormat().format(
        larger[1] - (usaEuSorted[rando][1] as number)
      )} km\u00B2 larger than ${usaEuSorted[rando][0]}, and ${
        smaller[0]
      } is ${new Intl.NumberFormat().format(
        (usaEuSorted[rando][1] as number) - smaller[1]
      )} km\u00B2 smaller.`;
      if (!qashes.has(q)) {
        qArray.push([q, a, `${larger[0]},${smaller[0]}`]);
        qashes.add(q);
        answers.push();
      }
    } else if (smaller || larger) {
      if (smaller) {
        const flag = usaEuSorted[rando][2];
        const q = `Which ${
          flag === "🇺🇸" ? "European country" : "US State (or Territory)"
        } is closest in size, but smaller than ${usaEuSorted[rando][0]}?`;
        const a = `${smaller[0]}.`;
        if (!qashes.has(q)) {
          qArray.push([q, a, smaller[0]]);
          qashes.add(q);
        }
      }
      if (larger) {
        const flag = usaEuSorted[rando][2];
        const q = `Which ${
          flag === "🇺🇸" ? "European country" : "US State (or Territory)"
        } is closest in size, but larger than ${usaEuSorted[rando][0]}?`;
        const a = `${larger[0]}.`;
        if (!qashes.has(q)) {
          qArray.push([q, a, larger[0]]);
          qashes.add(q);
        }
      }
    }
    i++;
  }
  return qArray;
}
