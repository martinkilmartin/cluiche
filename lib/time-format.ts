import {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  MONTH,
  YEAR,
} from '@constants/MILLISECOND_TIME'

const rtf = new Intl.RelativeTimeFormat('en', {
  localeMatcher: 'best fit',
  numeric: 'always',
  style: 'short',
})

const diffDate = (date: Date): number => {
  const DATE_NOW = new Date()
  return date.getTime() - DATE_NOW.getTime()
}

const diffAmount = (
  diff: number
): [number, 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year'] => {
  if (diff < -YEAR) {
    return [diff / YEAR, 'year']
  } else if (diff < -MONTH) {
    return [diff / MONTH, 'month']
  } else if (diff < -DAY) {
    return [diff / DAY, 'day']
  } else if (diff < -HOUR) {
    return [diff / HOUR, 'hour']
  } else if (diff < -MINUTE) {
    return [diff / MINUTE, 'minute']
  } else {
    return [diff / SECOND, 'second']
  }
}

const diffDisplay = (date: Date): string => {
  const DIFF = diffDate(date)
  const [value, style] = diffAmount(DIFF)
  const FORMATTED_DIFF_ARRAY = rtf.formatToParts(value, style)
  const FORMATTED_DIFF = `${FORMATTED_DIFF_ARRAY[0].value} ${
    FORMATTED_DIFF_ARRAY[FORMATTED_DIFF_ARRAY.length - 1].value
  }`
  return FORMATTED_DIFF
}

export default diffDisplay
