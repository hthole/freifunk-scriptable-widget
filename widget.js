// Licence: Hendrik Thole, Apache License 2.0
const apiUrl = "https://map.freifunk-nordhessen.de/data/meshviewer.json"
const nodeId = args.widgetParameter == null ? '30b5c20e9306' : args.widgetParameter

const widget = await createWidget()
if (!config.runsInWidget) {
  await widget.presentSmall()
}
widget.url = "https://map.freifunk-nordhessen.de/#!/de/map/" + nodeId
Script.setWidget(widget)
Script.complete()

async function createWidget(items) {
  const infoSize = 14
  const data = await getData()
  const list = new ListWidget()
  if(data) {
    
    const header = list.addText(data.hostname)
    header.font = Font.mediumSystemFont(10)
    list.addSpacer()
    
    const usersLabel = list.addText("Clients: " + data.clients.toString())
    usersLabel.font = Font.boldSystemFont(infoSize)
    usersLabel.textColor = Color.blue()

    const onlineStatusLabel = list.addText("Status: " + (data.is_online ? "online" : "offline"))
    onlineStatusLabel.font = Font.boldSystemFont(infoSize)
    onlineStatusLabel.textColor = data.is_online ? Color.green() : Color.orange()
    
    let formatter = new RelativeDateTimeFormatter()
    const lastseen = list.addText(formatter.string(new Date(data.lastseen), new Date()))
    lastseen.font = Font.boldSystemFont(10)
  } else {
    list.addText("Daten nicht verfügbar "+data)
  }
  return list
}

async function getData() {
   try {
      let data = await new Request(apiUrl).loadJSON()
 
      const attr = findNode(data.nodes, nodeId)
      log(data.timestamp)
      attr["update_timestamp"] = data.timestamp
      log(attr)
      return attr;
   } catch(e) {
    logError(e)
    return null
   }
  
 function findNode(data, id) {
    var found = null;  
    
    for (var i = 0; i < data.length; i++) {
        var element = data[i];

        if (element.node_id == id) {
           found = element;
           break;
       } 
    }  
    return found;
}
}
