export class Localize
{

    // Localize.FR, Localize.EN, nothing for auto detect
    static setTitlesFromIds(lang=null, fallback=Localize.FR)
    {
        if (!lang)
        {
            lang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
        }
        fetch("../lang/"+lang+".json")
            .then(response => response.json())
            .then(dictionary => {
                document.querySelectorAll('[id]').forEach(element => {
                    const id = element.getAttribute('id');
                    if (dictionary[id]) {
                        element.setAttribute('title', dictionary[id]);
                    }
                });
            })
            .catch( ()=> {if (fallback) Localize.setTitlesFromIds(fallback, null)});
    }
}
Localize.FR="fr";
Localize.EN="en";
