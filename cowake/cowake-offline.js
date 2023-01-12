
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
            <th>選択</th>
            <th>総部屋数</th>
            <th>内訳</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td><input type="radio" name="radio-session" value={ index.toString() } onChange={ changeRadio } /></td>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + "人部屋x" + group.numMaxRooms }</td>
              <td>{ group.numMinMembers + "人部屋x" + group.numMinRooms }</td>
            </tr>);
          })}
        </table>
      );
    } else {
      return (
        <table>
          <tr>
            <th>総部屋数</th>
            <th>内訳</th>
            <th></th>
          </tr>
          { this.state.groups.map((group, index) => {
            return (<tr>
              <td>{ group.numTotalRooms }</td>
              <td>{ group.numMaxMembers + "人部屋x" + group.numMaxRooms }</td>
              <td>{ group.numMinMembers + "人部屋x" + group.numMinRooms }</td>
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
        <th>{(i + 1) + "回目"}</th>
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
  document.getElementById("tsv").value = `N101	佐藤いちご	さとういちご
N102	鈴木もも	すずきもも
N103	高橋マスカット	たかはしマスカット
N104	田中なし	たなかなし
N105	伊藤ぶどう	いとうぶどう
N106	渡辺マンゴー	わたなべマンゴー
N107	山本メロン	やまもとメロン
N108	中村みかん	なかむらみかん
N109	小林りんご	こばやしりんご
N110	加藤すいか	かとうすいか
N111	吉田パイナップル	よしだパイナップル
N112	山田キウイ	やまだキウイ
N113	佐々木バナナ	ささきバナナ
N114	山口さくらんぼ	やまぐちさくらんぼ
N115	松本かき	まつもとかき
N116	井上ライチ	いのうえライチ
N117	木村パパイヤ	きむらパパイヤ
N118	林ざくろ	はやしざくろ
N119	斎藤すもも	さいとうすもも
N120	清水デコポン	しみずデコポン
N121	山崎レモン	やまざきレモン
N122	森オレンジ	もりオレンジ`
  minMembers.value = 3;
  memberCount.value = 22;
}

document.getElementById("enter-example").onclick = enterExample;
