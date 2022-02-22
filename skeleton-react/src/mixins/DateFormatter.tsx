import dayjs from 'dayjs';

class DateFormatter {
  day: number
  month: number
  year: number

  DEFAULT_FORMAT = 'YYYY-MM-DD';

  constructor(data?: Date) {
    let date: Date = (data !== undefined) ? data : new Date(Date.now());

    this.year = date.getFullYear();
    this.day = date.getDate();
    this.month = date.getMonth() + 1;
  }

  setData = (year: number, day: number, month: number) => {
    this.year = year;
    this.day = day;
    this.month = month;
  }

  getFormattedDate = (date: Date | string | undefined | null, format: string = this.DEFAULT_FORMAT) => {
    let data = (date === undefined || date === null) ? dayjs() : date;
    return dayjs(data).format(format);
  }
}

export default DateFormatter;