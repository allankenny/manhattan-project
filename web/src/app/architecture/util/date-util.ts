import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";

export class DateUtil {
    
    static formatNgbDateStructToString(date: NgbDateStruct | null): string {
        if(date) {
            const day = date.day < 10 ? '0' + date.day : date.day;
            const month = date.month < 10 ? '0' + date.month : date.month;
            return day.toString() + month.toString() + date.year;
        }
        return '';
    }

    static formatStringToNgbDateStruct(date: string | null): NgbDateStruct {
        if(date) {
            return {
                year: +date.slice(4,8),
                month: +date.slice(2,4),
                day: +date.slice(0,2)
            }
        }
        return null;
    }
}