import moment from "moment-timezone";
import { t } from "ttag";

const NUMERIC_UNIT_FORMATS = {
  // workaround for https://github.com/metabase/metabase/issues/1992
  year: value =>
    moment()
      .year(value)
      .startOf("year"),
  "minute-of-hour": value =>
    moment()
      .minute(value)
      .startOf("minute"),
  "hour-of-day": value =>
    moment()
      .hour(value)
      .startOf("hour"),
  "day-of-week": value =>
    moment()
      .weekday(value - 1)
      .startOf("day"),
  "day-of-month": value =>
    moment("2016-01-01") // initial date must be in month with 31 days to format properly
      .date(value)
      .startOf("day"),
  "day-of-year": value =>
    moment("2016-01-01") // initial date must be in leap year to format properly
      .dayOfYear(value)
      .startOf("day"),
  "week-of-year": value =>
    moment()
      .week(value)
      .startOf("week"),
  "month-of-year": value =>
    moment()
      .month(value - 1)
      .startOf("month"),
  "quarter-of-year": value =>
    moment()
      .quarter(value)
      .startOf("quarter"),
};

// only attempt to parse the timezone if we're sure we have one (either Z or ±hh:mm or +-hhmm)
// moment normally interprets the DD in YYYY-MM-DD as an offset :-/
export function parseTimestamp(value, unit = null, local = false) {
  let m;
  if (moment.isMoment(value)) {
    m = value;
  } else if (typeof value === "string" && /(Z|[+-]\d\d:?\d\d)$/.test(value)) {
    m = moment.parseZone(value);
  } else if (unit in NUMERIC_UNIT_FORMATS && typeof value == "number") {
    m = NUMERIC_UNIT_FORMATS[unit](value);
  } else {
    m = moment.utc(value);
  }
  return local ? m.local() : m;
}

export function parseTime(value) {
  if (moment.isMoment(value)) {
    return value;
  } else if (typeof value === "string") {
    return moment.parseZone(value, [
      "HH:mm:SS.sssZZ",
      "HH:mm:SS.sss",
      "HH:mm:SS.sss",
      "HH:mm:SS",
      "HH:mm",
    ]);
  } else {
    return moment.utc(value);
  }
}

export function formatHourAMPM(hour) {
  if (hour > 12) {
    const newHour = hour - 12;
    return t`${newHour}:00 PM`;
  } else if (hour === 0) {
    return t`12:00 AM`;
  } else if (hour === 12) {
    return t`12:00 PM`;
  } else {
    return t`${hour}:00 AM`;
  }
}

export function formatDay(day) {
  switch (day) {
    case "mon":
      return t`Monday`;
    case "tue":
      return t`Tuesday`;
    case "wed":
      return t`Wednesday`;
    case "thu":
      return t`Thursday`;
    case "fri":
      return t`Friday`;
    case "sat":
      return t`Saturday`;
    case "sun":
      return t`Sunday`;
    default:
      return day;
  }
}

export function formatFrame(frame) {
  switch (frame) {
    case "first":
      return t`first`;
    case "last":
      return t`last`;
    case "mid":
      return t`15th (Midpoint)`;
    default:
      return frame;
  }
}

export function getRelativeTime(timestamp) {
  return moment(timestamp).fromNow();
}
