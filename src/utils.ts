
export function DateFormat(date: Date): string {
    const data = new Date(
        date.toLocaleString('zh-CN', {
            timeZone: 'Asia/Shanghai'
        })
    );
    let result = `${data.getFullYear()}-${data.getMonth()}-${data.getDay()} ${data.getHours()}:${data.getMinutes()}`
    return result
}
