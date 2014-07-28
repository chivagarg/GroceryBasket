function QueryItemFromNutritionX()
{
  var paramString='{"appId":"9ca93004", "appKey": "769a7bfd0563bf4e30441f56c4c833e2", "query": "Cheddar Cheese"}';
  var url = "https://api.nutritionix.com/v1_1/search";
  LoadXml("POST",paramString,url,function()
  {
    if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      document.getElementById("myDiv").innerHTML=xmlhttp.responseText;
    }
  });
}

function LoadXml(requestType,paramString,url,cfunc)
{
  if (window.XMLHttpRequest)
  {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
  }
  else
  {// code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=cfunc;

  xmlhttp.open(requestType,url,true);
  
  if (requestType === "POST")
    xmlhttp.setRequestHeader("Content-type","application/json");
  
  xmlhttp.send(paramString);
}

function ItemNameResolver()
{
   document.getElementById("myDiv").innerHTML = "Hey there Delilah!";
}