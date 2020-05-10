import { WebhookRefConstants } from './constants';

export class Util {

  private static readonly Month = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apl",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"

  }

  createDateForDisplay(date: string): string {

    if (date == null || date == undefined){
        return null;
    }

    const input = new Date(date);
    let year = input.getFullYear();
    let month = input.getMonth() + 1;
    let day = input.getDate();

    return Util.Month[month] + ', ' + day + ', ' + year;

  }

  createWebhookRefData(user_id: string, type: string): any {
    var ref_data = {}
    ref_data[WebhookRefConstants.KEY_USER_ID] = user_id;
    ref_data[WebhookRefConstants.KEY_TYPE] = type;

    return ref_data; 
  }

}
