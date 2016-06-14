  var panelArr = [];
  var Agents = new UserAgents(1);
  function addResources(pid) {
      $("#agent-add-" + pid).show();
      panelArr.forEach(function(e, index) {
          if (e != pid) {
              $("#agent-add-" + e).hide();
          }
      });
  }

  function closePanel(pid) {
      $("#agent-add-" + pid).hide();
      $("#agent-input-" + pid).val("");
      $("#msg-" + pid).hide();
  }

  function deleteResources(agentid, id) {
      Agents.deleteResources(agentid, id, function(agentid, rid) {
          $("#agent_" + agentid + " .details .resources .resources-list ul li").forEach(function(e, index) {
              if (e.id == rid) {
                  if (e.remove) {
                      e.remove();
                  } else {
                      e.removeNode(true);
                  }

              }
          });
      })
  }

  function addAgent(pid) {
      var agentsValue = $("#agent-input-" + pid).val();
      if (!agentsValue) {
          $('#agent-input-' + pid).focus();
          $("#msg-" + pid).show();
      } else {
          $("#msg-" + pid).hide();
          var resourcsArr = agentsValue.split(/,|，/);
          Agents.addResources(pid, resourcsArr, function(agentId, result) {
              $("#agent-add-" + pid).hide();
              $("#agent-input-" + pid).val("");
              var resources = "";
              result.forEach(function(er) {
                  resources = resources + '<li id="' + er.id + '" data-agentid="' + er.agentId + '">' + er.name + ' <span class="delete-resource" id="' + er.id + '" onclick="deleteResources(' + er.agentId + ', ' + er.id + ') ">x</span></li>'
              });
              $("#agent_" + pid + " .details .resources .resources-list ul").append(resources);
          })

      }

  }

  $.ready(function() {
      var handlerOrientationChange = function() {
          var width = (window.innerWidth <= 600) ? 600 : ((window.innerWidth >= 1024) ? 1024 : window.innerWidth);
          var fontSize = 100 * (width / 1024);
          document.documentElement.style.fontSize = fontSize + "px";
          setFloatStyle();

      };
      window.onresize = handlerOrientationChange;
      handlerOrientationChange();
      $('#userName').text(Agents.userName);
      Agents.historys.forEach(function(e, index) {
          $('#history').append('<li>' + e + '</li>');
      });

      Agents.types.forEach(function(e, index) {
          $('#tags').append('<span class="tag cursor-pointer" id="' + e + '">' + e + '</span>');
          if (e === Agents.activeTypes) {
              $('#' + e).addClass('active-tag');
          }
          $('#' + e).on('click', function() {
              $(this).addClass('active-tag');
              $('#tags span').forEach(function(el, index) {
                  if (e !== el.id) {
                      $(el).removeClass('active-tag');
                  }
              });
              $('#articles').html('');
              var type = e;
              initArticles(type)
          })
      });
      if (!String.prototype.replaceAll) {
          String.prototype.replaceAll = function(substr, newSubstr) {
              var re = new RegExp("" + substr + "", "gim");
              return this.replace(re, newSubstr);
          };
      }
      initArticles('All');
      function initArticles(type) {
          var statusCount = Agents.statusCount(type);
          $('#building').text(statusCount['building']);
          $('#idle').text(statusCount['idle']);
          var list = "";
          var resutlAgents=Agents.getAgentsByType(type);          
          resutlAgents.forEach(function(e) {
              var tplStr = $("#tpl").html();
              tplStr = tplStr.replaceAll('{id}', e.id)
                  .replaceAll('{email}', e.email)
                  .replaceAll('{status}', e.status)
                  .replaceAll('{ip}', e.ip)
                  .replaceAll('{path}', e.path);
              var resources = "";
              e.resources.forEach(function(er) {
                  resources = resources + '<li id="' + er.id + '" data-agentid="' + er.agentId + '">' + er.name + ' <span class="delete-resource" onclick="deleteResources(' + er.agentId + ', ' + er.id + ') " id="' + er.id + '">x</span></li>'
              });
              tplStr = tplStr.replaceAll('{resources}', resources);
              if (e.status == 'idle') {
                  tplStr = tplStr.replaceAll('{is-show-deny}', '');
              } else {
                  tplStr = tplStr.replaceAll('{is-show-deny}', 'style="display:none "');
              }
              tplStr = tplStr.replaceAll('{status-style}', e.status == 'idle' ? 'deny-status' : 'building-status');
              list = list + tplStr;

          });
          $("#articles").append(list);
      } 
      function setFloatStyle() {
          $(".aside")[0].style.height = 'auto';
          $(".aside")[0].style.borderLeft = "none";
          if ($(".aside")[0].offsetHeight < $(".articles")[0].offsetHeight) {
              if ($(".aside")[0].offsetLeft > $(".articles")[0].offsetLeft + 800) {
                  $(".aside")[0].style.height = $(".articles")[0].offsetHeight + "px";
                  //$(".aside")[0].style.borderLeft = ".02rem solid black";
              } else {
                  $(".aside")[0].style.borderLeft = "";
              }

          }
      }
  })
  $('#bashboard').on('click', function() {


  })
