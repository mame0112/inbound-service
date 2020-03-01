export class Util {

    createDateForDisplay(date: string): string {

      if (date == null || date == undefined){
          return null;
      }

      const input = new Date(date);
      let year = input.getFullYear();
      let month = input.getMonth() + 1;
      let day = input.getDate();

      return year + ' / ' + month + ' / ' + day;

    }
}
