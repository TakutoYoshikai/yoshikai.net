
class GroupInfoTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: props.groups,
      selectable: props.selectable,
    }
  }
  render() {
    if (this.state.selectable) {
      return (
        <table>
          <tr>
            <th>Select</th>
            <th>All Rooms</th>
            <th>Patterns</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td><input type="radio" name="radio-session" value={ index.toString() } onChange={ changeRadio } /></td>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + " rooms / " + group.numMaxRooms + " members each" }</td>
              <td>{ group.numMinMembers + " rooms / " + group.numMinRooms + " members each" }</td>
            </tr>);
          })}
        </table>
      );
    } else {
      return (
        <table>
          <tr>
            <th>All Rooms</th>
            <th>Patterns</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + " rooms / " + group.numMaxRooms + " members each" }</td>
              <td>{ group.numMinMembers + " rooms / " + group.numMinRooms + " members each" }</td>
            </tr>);
          })}
        </table>
      );

    }
  }
}

class MemberTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: props.group,
      memberRooms: props.group.memberRooms(),
    }
  }
  render() {
    const sessionHeaders = [];
    for (let i = 0; i < this.state.memberRooms[0].rooms.length; i++) {
      sessionHeaders.push(
        <th>{"#" + (i + 1)}</th>
      )
    }
    let roomNo = 0;
    return (
      <table id="group">
        <thead>
          <tr>
            <th class="no-sort" data-sort-method="none">Room No.</th>
            <th id="id1">ID1</th>
            <th>ID2</th>
            <th>ID3</th>
            { sessionHeaders }
          </tr>
        </thead>
        <tbody>
        { this.state.memberRooms.map((memberRoom, index) => {
          let member = memberRoom.member;
          let rooms = memberRoom.rooms;
          return (
            <tr>
              <td>{ rooms[0] }</td>
              <td>{ member.data[0] }</td>
              <td>{ member.data.length >= 2 ? member.data[1] : "" }</td>
              <td>{ member.data.length >= 3 ? member.data[2] : "" }</td>
              {
                rooms.map((room) => {
                  return <td>{room}</td>
                })
              }
            </tr>
          );
        }) }
        </tbody>
      </table>
    );
  }
}

let currentGroups = null;
let memberTable = null;
let groupInfo = null;
let groupInfoForConfirm = null;

function changeRadio() {
  var radio = document.getElementsByName("radio-session");
  for(let i = 0; i < radio.length; i++){
    if (radio[i].checked) {
      showRooms(currentGroups, i); 
      return;
    }
  }
}

function confirmParams() {
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let memberCount = parseInt(document.getElementById("member-count").value);
  let groups = makeGroupsByMemberCount(memberCount, minMembers);
  if (groupInfoForConfirm === null) {
    ReactDOM.render(<GroupInfoTable ref={(c) => groupInfoForConfirm = c} groups={groups} selectable={false} />, document.getElementById("params-result"));
  } else {
    groupInfoForConfirm.setState({
      groups: groups,
    });
  }
}

function showRooms(groups, groupIndex) {
  if (groupIndex >= groups.length) {
    return;
  }

  ReactDOM.render(<GroupInfoTable ref={(c) => groupInfo = c} groups={groups} selectable={true} />, document.getElementById("group-info"));

  if (memberTable !== null) {
    groupInfo.setState({
      groups: groups,
    });
    let elem = document.getElementById("result");
    elem.parentNode.removeChild(elem);
    elem = document.createElement("div");
    elem.id = "result";
    document.getElementById("result-wrapper").appendChild(elem);
  } 
  ReactDOM.render(<MemberTable ref={(c) => memberTable = c} group={groups[groupIndex]} />, document.getElementById("result"));
  let sort = new Tablesort(document.getElementById("group"));
  let sortFlag = false;
  document.getElementById("group").addEventListener("beforeSort", function() {
    console.log("before sort");
    if (!sortFlag) {
      sortFlag = true;
      sort.refresh();
      document.getElementById("id1").click();
      document.getElementById("id1").click();
      sortFlag = false;
    }
  });
  document.getElementById("download").style.display = "block";

}


document.getElementById("submit").onclick = function() {
  let tsv = document.getElementById("tsv").value;
  let minMembers = parseInt(document.getElementById("minMembers").value);
  let members = parseTsvFront(tsv);
  let groups = makeGroups(members, minMembers);
  if (groups.length == 0) {
    alert("そのグループ最小人数と参加者数では組分けを作れません");
    return;
  }
  currentGroups = groups;
  showRooms(groups, 0);
  var radios = document.getElementsByName("radio-session");
  if (radios.length > 0) {
    radios[0].checked = true;
  }

}

let minMembers = document.getElementById("minMembers");
let memberCount = document.getElementById("member-count");

let mMinMembers = document.getElementById("m-min-members");
let pMinMembers = document.getElementById("p-min-members");
let mMemberCount = document.getElementById("m-member-count");
let pMemberCount = document.getElementById("p-member-count");
let confirmButton = document.getElementById("confirm");

mMinMembers.onclick = function() {
  let value = parseInt(minMembers.value);
  if (value <= 1) {
    minMembers.value = 1;
    return;
  }
  minMembers.value = (value - 1).toString();
}
pMinMembers.onclick = function() {
  let value = parseInt(minMembers.value);
  if (value >= 240) {
    minMembers.value = 240;
    return;
  }
  minMembers.value = (value + 1).toString();
}

mMemberCount.onclick = function() {
  let value = parseInt(memberCount.value);
  if (value <= 1) {
    memberCount.value = 1;
    return;
  }
  memberCount.value = (value - 1).toString();
}
pMemberCount.onclick = function() {
  let value = parseInt(memberCount.value);
  if (value >= 240) {
    memberCount.value = 240;
    return;
  }
  memberCount.value = (value + 1).toString();

}
confirmButton.onclick = function() {
  confirmParams();
}

function enterExample() {
  document.getElementById("tsv").value = `N001	Garnet Smith	Garnet.Smith@example.com
N002	Amethyst Johnson	Amethyst.Johnson@example.com
N003	Aquamarine Williams	Aquamarine.Williams@example.com
N004	Bloodstone Brown	Bloodstone.Brown@example.com
N005	Coral Jones	Coral.Jones@example.com
N006	Diamond Miller	Diamond.Miller@example.com
N007	Emerald Davis	Emerald.Davis@example.com
N008	Jade Garcia	Jade.Garcia@example.com
N009	Moonstone Rodriguez	Moonstone.Rodriguez@example.com
N010	Pearls Wilson	Pearls.Wilson@example.com
N011	Ruby Martinez	Ruby.Martinez@example.com
N012	Peridot Anderson	Peridot.Anderson@example.com
N013	Thirdonics Taylor	Thirdonics.Taylor@example.com
N014	Sapphire Thomas	Sapphire.Thomas@example.com
N015	Opal Hernandez	Opal.Hernandez@example.com
N016	Tourmaline Moore	Tourmaline.Moore@example.com
N017	Topaz Martin	Topaz.Martin@example.com
N018	Citrine Jackson	Citrine.Jackson@example.com
N019	Turquoise Thompson	Turquoise.Thompson@example.com
N020	Lapis Lazuli White	Lapis.Lazuli.White@example.com
N021	Tanzanite Lopez	Tanzanite.Lopez@example.com
N022	Gold Lee	Gold.Lee@example.com`
  minMembers.value = 3;
  memberCount.value = 22;
}

document.getElementById("enter-example").onclick = enterExample;
