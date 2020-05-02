
export class Problems{
    public static readonly problems = {
        '01_exit': {'icon': 'exit', 'label': 'Exit of big station'},
        '02_language': {'icon': 'language', 'label': 'Japanese language'},
        '03_restaurant': {'icon': 'restaurant', 'label': 'Best restaurant for me'},
        '04_lost': {'icon': 'lost', 'label': 'How to get my destination'},
        '05_train': {'icon': 'train', 'label': 'How to buy ticket & get in train'},
        '06_menu': {'icon': 'menu', 'label': 'Japanese menu'},
        '07_manner': {'icon': 'manner', 'label': 'Japanese manner'},
        '99_others': {'icon': 'others', 'label': 'Others'}
    }

    constructor(){
    }

    getIconName(id: string): string{
        if(id != null){
            return Problems.problems[id]['icon'];
        }

        return null;
    }

    getLabel(id: string): string{
        if(id != null){
            return Problems.problems[id]['label'];
        }

        return null;
    }

}
