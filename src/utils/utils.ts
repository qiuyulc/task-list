export const getWeekTime = () => {
  // var new_Date = new Date('2023-01-01') //获取指定日期当周的一周日期
  const new_Date = new Date(); //获取本周一周日期
  const timesStamp = new_Date.getTime();
  const currenDay = new_Date.getDay();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const das = new Date(
      timesStamp + 24 * 60 * 60 * 1000 * (i - ((currenDay + 6) % 7))
    ).toLocaleDateString();
    // das.replace(/[年月]/g, '.').replace(/[日上下午]/g, '');
    dates.push(das);
  }
  return dates;
};


export function findDifferentItems(arr1:string[], arr2:string[]) {
  const diff1 = arr1.filter(item => !arr2.includes(item));
  const diff2 = arr2.filter(item => !arr1.includes(item));
  return [...diff1, ...diff2];
}