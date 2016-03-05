// Update UI when list name changes
function updateUIFromWorkingExample() {

    var exampleSelected = $("#WorkingExampleSel").val();
    console.log("Updating UI for working example for " + exampleSelected);

    // Update UI values
    switch(exampleSelected){
          case 'email':     
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("email");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'ip':        
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("ip");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'fqdn':      
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("fqdn");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'domain':    
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("domain");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'mac':       
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MapTypeSel").val("mac");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'account':   
              $("#SourceTypeSel").val("Mongo");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("account");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'BL':        
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("BL");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'WL':        
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("WL");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'DBL':       
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("DBL");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'DWL':  
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("DWL");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'DM':        
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("DM");
              $("#SearchFilter").val("00166C7C384C");
              break;
          case 'HBRD':      
              $("#SourceTypeSel").val("EntityMap");
              $("#EntTypeSel").val("list");
              $("#EntityName").val("RogueAP MAC WL");
              $("#MappingTypeSel").val("HBRD");
              $("#SearchFilter").val("00166C7C384C");
              break;
          default:
              console.log("FAIL: Example Selected value is not supported yet (or invalid):", exampleSelected);
    }
}    
   