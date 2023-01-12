class Member {
  constructor(data) {
    this.data = data;
  }
}

class Group {
  constructor(members, numTotalRooms, numMaxMembers, numMaxRooms, numMinMembers, numMinRooms, numSessions, introTime) {
    this.members = members;
    this.numTotalRooms = numTotalRooms;
    this.numMaxMembers = numMaxMembers;
    this.numMaxRooms = numMaxRooms;
    this.numMinMembers = numMinMembers;
    this.numMinRooms = numMinRooms;
    this.numSessions = numSessions;
    this.introTime = introTime;
  }
  session(n) {
    let rooms = [];
    for (let i = 0; i < this.numTotalRooms; i++) {
      rooms.push([this.members[i]]);
    }
    for (let i = this.numTotalRooms; i < this.members.length; i++) {
      let member = this.members[i];
      let firstSession = i % this.numTotalRooms;
      let diff = (Math.floor(i / this.numTotalRooms) * n);
      let nSession = (firstSession + diff) % this.numTotalRooms;
      rooms[nSession].push(member);
    }
    return rooms;
  }
  allSessions() {
    let sessions = [];
    for (let i = 0; i < this.numTotalRooms; i++) {
      sessions.push(this.session(i));
    }
    return sessions;
  }
  memberRooms() {
    let result = [];
    for (let i = 0; i < this.numTotalRooms; i++) {
      let session = i + 1;
      let memberRoom = [];
      for (let n = 0; n < this.numSessions; n++) {
        memberRoom.push(session);
      }
      result.push({
        member: this.members[i],
        rooms: memberRoom,
      });
    }
    for (let i = this.numTotalRooms; i < this.members.length; i++) {
      let memberRoom = [];
      for (let n = 0; n < this.numSessions; n++) {
        let firstSession = i % this.numTotalRooms;
        let diff = (Math.floor(i / this.numTotalRooms) * n);
        let nSession = (firstSession + diff) % this.numTotalRooms;
        memberRoom.push(nSession + 1);
      }
      result.push({
        member: this.members[i],
        rooms: memberRoom,
      });
    }
    result = result.sort(function(a, b) {
      return a.rooms[0] - b.rooms[0];
    });
    let j = 1;
    let k = 0;
    for (let i = 0; i < result.length; i++) {
      if (result[i].rooms[0] > j) {
        k = 1;
        j++;
      } else {
        k++;
      }
      result[i].rooms.push(k);
    }
    return result;
  }
}

function parseTsv(text) {
  const parse = require("csv-parse/lib/sync");
  let members = [];
  let records = parse(text, {
    delimiter: "\t"
  });
  
  for (let record of records) {
    if (record.length > 3) {
      throw new Error("csv parse error");
    }
    members.push(new Member(record));
  }
  return members;
}

function parseTsvFront(text) {
  let members = [];
  let records = Papa.parse(text, {
    delimiter: "\t",
    header: false,
  }).data;
  
  for (let record of records) {
    if (record.length > 3) {
      throw new Error("csv parse error");
    }
    members.push(new Member(record));
  }
  return members;
}

function isPrimeNumber(n) {
  if (n === 2) return true;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}
function makePrimeNumbers() {
  let n = 1;
  let result = [];
  while (n <= 200) {
    if (isPrimeNumber(n)) {
      result.push(n);
    }
    n++;
  }
  return result;
}


let primeNumbers = makePrimeNumbers();
let NUM_MAX_ROOMS = 1000;

function makeGroupsByMemberCount(count, minMembers) {
  let groups = [];

  for (let n of primeNumbers) {
    if (n <= NUM_MAX_ROOMS) {
      let numMinMembers = Math.floor(count / n);
      let numMaxMembers = numMinMembers + 1;
      let numMaxRooms = count % n;
      let numMinRooms = n - numMaxRooms;
      let numSessions = n;
      if (minMembers <= numMinMembers && n >= numMaxMembers) {
        let group = new Group(null, n, numMaxMembers, numMaxRooms, numMinMembers, numMinRooms, numSessions, null);
        groups.push(group);
      }
    }
  }
  return groups;
}
function makeGroups(members, minMembers) {
  let groups = [];

  for (let n of primeNumbers) {
    if (n <= NUM_MAX_ROOMS) {
      let numMinMembers = Math.floor(members.length / n);
      let numMaxMembers = numMinMembers + 1;
      let numMaxRooms = members.length % n;
      let numMinRooms = n - numMaxRooms;
      let numSessions = n;
      if (minMembers <= numMinMembers && n >= numMaxMembers) {
        let group = new Group(members, n, numMaxMembers, numMaxRooms, numMinMembers, numMinRooms, numSessions, null);
        groups.push(group);
      }
    }
  }
  return groups;
}

function uniq(array) {
  const uniquedArray = [];
  for (const elem of array) {
    if (uniquedArray.indexOf(elem) < 0)
      uniquedArray.push(elem);
  }
  return uniquedArray;
}
function test() {
  let members = [];
  for (let i = 1; i <= 50; i++) {
    members.push(new Member([i.toString(), "member" + i]));
  }
  let group = makeGroups(members, 3)[1];
  let max = group.numMaxMembers;
  let min = group.numMinMembers;
  let dic = {};
  for (let i = 1; i <= 50; i++) {
    dic[i.toString()] = [];
  }
  for (let session of group.allSessions()) {
    for (let group of session) {
      if (group.length !== max && group.length !== min) {
        console.log("failed test");
        return;
      }
      for (let memberA of group) {
        for (let memberB of group) {
          if (memberA.data[0] != memberB.data[0]) {
            dic[memberA.data[0]].push(memberB.data[0]);
          }
        }
      }
    }

    for (let i = 1; i <= 50; i++) {
      dic[i.toString()].sort(function(a, b) {
        return a - b;
      });
      if (dic[i.toString()].length != uniq(dic[i.toString()]).length) {
        console.log("failed test");
        return;
      }
    }
  }
  console.log("success");
}

module.exports = {
  Member: Member,
  Group: Group,
  makeGroups: makeGroups,
  parseTsv: parseTsv,
}
