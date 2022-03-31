import { format } from "date-fns";
import { getSurvey, setLastSaved } from "@/state/survey-state";
import { getApplicationId } from "@/state/application-state";
import { SurveyDataService } from "@/services/survey-data-service";
import bootstrapCss from "!!raw-loader!@/styles/bootstrapCSS.css";
import pdfCss from "!!raw-loader!@/styles/_pdf.css";

//These are used inside of our components to convert from code and ` to a vue component.
export const convertCodeMarkupToToolTip = (str: string) => {
  return str?.replace(/<code>(.*?)<\/code>/g, (wholeMatch, m1) => {
    return `<tooltip title="${m1}"/>`;
  });
};

export const convertTicksToToolTip = (str: string) => {
  return str?.replace(/`(.*?)`/g, (wholeMatch, m1) => {
    return `<tooltip title="${m1}"/>`;
  });
};

export const getSurveyEnvironment = () => {
  const host = window.location.host;
  const DEV = ["0.0.0.0", "localhost", "dev."];
  const TEST = ["test."];
  if (DEV.some(s => host.includes(s))) {
    return "DEV";
  } else if (TEST.some(s => host.includes(s))) {
    return "TEST";
  } else {
    return "PROD";
  }
};

export const getBCEIDUrl = () => {
  switch (getSurveyEnvironment()) {
    default:
    case "DEV":
      return "https://www.development.bceid.ca/os/?2242";
    case "TEST":
      return "https://www.test.bceid.ca/os/?8721";
    case "PROD":
      return "https://www.bceid.ca/os/?7651";
  }
};

export const dateFormatter = dateString => {
  return formatMonthDayYear(new Date(dateString.replace(/-/g, "/")));
};

export const formatCityCountry = mailingAddress => {
  return `${mailingAddress?.city}, ${mailingAddress?.country}`;
};

export const formatMailingAddress = (mailingAddress: AddressAndContact): string => {
  if (!mailingAddress) return null;
  return `${mailingAddress?.street || ""}, ${mailingAddress?.city || ""}, ${mailingAddress?.state ||
    ""}, ${mailingAddress?.country || ""} ${mailingAddress?.postalCode || ""}`;
};

export const formatAddressWithPostalCode = (mailingAddress: AddressAndContact): string => {
  if (!mailingAddress) return null;
  return `${mailingAddress?.street || ""}, ${mailingAddress?.city || ""}, ${mailingAddress?.state ||
    ""}, ${mailingAddress?.postalCode || ""}, ${mailingAddress?.country || ""}`;
}

export const formatDeceasedName = (deceasedName: PersonName): string => {
  return `${deceasedName?.first || ""} ${deceasedName?.middle || ""} ${deceasedName?.last || ""}`;
};

export const formatMonthDayYear = date => {
  return format(date, "MMMM d, yyyy");
};

export const convertBlobAndDownload = (blob, formName) => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.download = `${formName}.pdf`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
};

export const formPdfHtml = (html, footerLeft, footerRight, headerRight, headerFormat = "") => {
  const header = headerFormat === "pgt"
    ? {
        "fontSize": "8pt",
        "fontFamily": "BC Sans Regular",
        "fontWeight": "normal",
        "colour": "#606060"
      }
    : {
        "fontSize": "16pt",
        "fontFamily": "BC Sans",
        "fontWeight": "bold",
        "colour": "#000000"
      };

  const body = [
    `<!DOCTYPE html>
    <html lang="en">
      <head>		
      <meta charset="UTF-8">
      <title>Representation Grant</title>
        <style>
        @page {
          size: 8.5in 11in !important;
          margin: 0.68in 0.75in 0.75in 0.75in !important;
          font-size: 11pt !important;
          @top-right {
            content: '${headerRight}';
            font-size: ${header.fontSize};
            font-family: '${header.fontFamily}' !important;
            font-weight: ${header.fontWeight};
            color: ${header.colour};
          }
          @bottom-left {
            content: '${footerLeft}';
            white-space: pre;
            font-size: 8pt;
            font-family: 'BC Sans Regular' !important;
            color: #606060;
          }
          @bottom-right {
            content: "${footerRight} Page " counter(page) " of " counter(pages);
            font-size: 8pt;
            font-family: 'BC Sans Regular' !important;
            color: #606060;
          }
        }
        @media print {
          .new-page {
            page-break-before: always;
            position: relative; top: 8em;
          }
        }
        ${bootstrapCss}
        ${pdfCss}
        </style>
      </head>
      <body>
        <div class="print-container">
            ${html}
        </div>
      </body>
    </html>`
  ];
  console.log(body[0]);
  return body;
};

export const saveSurvey = async () => {
  try {
    const applicationId = getApplicationId.value;
    const data = getSurvey.value.data;
    if (!data) return;
    const result = SurveyDataService.updateApplication(applicationId, data);
    setLastSaved(new Date());
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};
