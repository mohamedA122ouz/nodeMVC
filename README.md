# eHtml - edited Html -
>eHtml is regular html with those addons
- ~VariableName
- ~loopName@{<>HTML TAGES INSIDE</>}@
- ~SWITCHVARIABLE#{?CASE1?<></>$?CASE2?<></>$....}#
- $str$ = string datatype _can only works with switch statements_
- $obj$ = object datatype _can only works with switch statements_
# How MVC Naming convention
- Controller must named ControllerName.AnyText.ts
- View (HTML files) ControllerName.HTMLTitle.ts
> No naming convention followed on assets or on Modles
## What if you don't follow naming convention ?
naming convention makes things easy to be auto fulfilled and auto completed.
- first you will need to pass '@' to eHtml which is the controller name to avoid communication issues 
- also you will need to pass title to the eHtml or adding it manual to the eHtml
> may also recieve unexpected errors espcially if you don't follow naming convention on Controllers

Instead of the privious a new Function added to avoid typing the path of the view if the controller second part has the same name of the view
`ControllerText.ViewName.ts` and the view has `ViewName.html`
then all you want to do is the following  
intialize the function 
```ts
import { PrepareView } from "../index";
const View = PrepareView(import.meta.url);
```
then in your endpoint you just need to call `View`, like the following:  

```ts
    res.send(View(data));
```

