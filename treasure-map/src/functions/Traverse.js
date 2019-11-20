import axios from 'axios';

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function playerTravel(direction) {
    const backendUrl = 'https://lambda-treasure-hunt.herokuapp.com'
    let nextRoom = null;

    console.log('key', localStorage.getItem('key'))
    const auth = `Token ${localStorage.getItem("key")}`
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
        },
    }
    console.log('traveled', options, direction)
    return axios
                .post(`${backendUrl}/api/adv/move/`, { 'direction': direction }, options)
                .then(result => {
                    console.log(result.data)
                    nextRoom = result.data
                    console.log('nextroom', nextRoom)
                    return nextRoom
                })
};



function traverse(room, currentRooms) {
    currentRooms[room.room_id] = room
    let allVisited = JSON.parse(localStorage.getItem('allVisited'))
    // return currentRooms

    let traversalPath = []
    let visited = {}
    let currRoom = room

    if (allVisited) {
        visited = allVisited
    }
    if (!(room.room_id in visited)) {
        visited[room.room_id] = { title: currRoom.title, coordinates: currRoom.coordinates }
        visited[room.room_id]['exits'] = {}
        for (let i = 0; i < room.exits.length; i++) {
            visited[room.room_id]['exits'][room.exits[i]] = '?'
        }
    }



    // loop until all rooms have been explored (all rooms added to visited)
    // change to 500
    // while (visited.length !== 50) {
    async function roomStep() {
        let runBack = 0;

        if (visited.length === 499) {
            return
        }

        // get the current room, id, and exits
        console.log('currroom', currRoom)
        let roomId = currRoom.room_id
        let roomExits = currRoom.exits

        // create a list of unvisited rooms for the visited list
        let unvisited = []
        for (let element in visited[roomId]['exits']) {
            if (visited[roomId]['exits'][element] == '?') {
                unvisited.push(element)
            }
        };
        console.log(unvisited)

        if (unvisited.length > 0) {
            // grab random unvisited room
            let nextDirectionIndex = Math.floor(Math.random() * (unvisited.length))
            let nextDirection = unvisited[nextDirectionIndex]

            // move to a new room
            // console.log(nextDirection)
            // console.log(currRoom)

            currRoom = await playerTravel(nextDirection)
            let nextRoomId = currRoom.room_id
            // set the previous room direction and new room direction accordingly
            console.log(currRoom)
            // setTimeout(() => console.log(currRoom), currRoom.cooldown * 1000);
            // break;
            visited[roomId]['exits'][nextDirection] = nextRoomId;
            // if new room not visited add it to visited
            if (!(nextRoomId in visited)) {
                let nextExits = currRoom.exits
                visited[nextRoomId] = { title: currRoom.title, coordinates: currRoom.coordinates }
                visited[nextRoomId]['exits'] = {}
                for (let i = 0; i < currRoom.exits.length; i++) {
                    visited[currRoom.room_id]['exits'][currRoom.exits[i]] = '?'
                }
            }
            let reverseDirs = { "n": "s", "s": "n", "e": "w", "w": "e" }
            let reverseDir = reverseDirs[nextDirection]
            visited[nextRoomId]['exits'][reverseDir] = roomId
            console.log(visited)


        } else {
            // run a search to return to the nearest room with an unexplored direction
            console.log('dead end', roomId)
            let stack = []
            let visited_search = new Set()
            stack.push([roomId])
            let found = 0
            let foundPath = []
            // console.log(stack, stack[0])

            while (stack.length > 0 && found === 0) {
                let reverseTraversal = []
                let path = stack.pop()
                console.log(path, path[path.length - 1])
                let node = path[path.length - 1]
                let searchRoom = visited[node]['exits']
                console.log(searchRoom)
                if (!(node in visited_search)) {
                    visited_search.add(node)
                    console.log(visited_search)
                }

                for (let direction in searchRoom) {
                    console.log('-------direction---', direction)
                    if (searchRoom[direction] === '?') {
                        foundPath = path
                        found += 1
                    }
                }
                if (found > 0) {
                    break;
                }

                let exploredDirections = []
                for (let direction in searchRoom) {
                    console.log('e******direction---', direction)
                    if (searchRoom[direction] !== '?') {
                        let value = searchRoom[direction]
                        console.log('v and p', value, path)
                        if (!(path.includes(value))) {
                            exploredDirections.push(direction)
                        }
                    }
                }
                console.log('explored idrections', exploredDirections)
                for (let direction in exploredDirections) {
                    direction = exploredDirections[direction]
                    console.log('direction---------', direction)
                    reverseTraversal.push(direction)
                    let new_path = [...path]
                    console.log('serach room direction', direction, searchRoom[direction])
                    new_path.push(searchRoom[direction])
                    console.log('newpath', new_path)
                    stack.push(new_path)
                }
            }
            let previous = foundPath[0];
            let trackIndex = 1;
            function startBackTrack() {
                async function backTrack() {
                    if (trackIndex >= foundPath.length) {
                        // trackIndex = 1
                        currRoom.cooldown += currRoom.cooldown
                        console.log('____returnFinish room____', currRoom)
                        return currRoom
                        // return setTimeout(() => roomStep(), currRoom.cooldown * 1000);
                    }
                    let pathRoom = foundPath[trackIndex];

                    console.log('end-- pathroom', pathRoom, previous)

                    for (let way in visited[previous]['exits']) {
                        console.log('end-- way', way)
                        if (visited[previous]['exits'][way] == pathRoom) {
                            console.log('way-- selected', way, visited[previous]['exits'])
                            console.log('currentroomReturn', currRoom)
                            currRoom = await playerTravel(way)
                            let pathRoomId = currRoom.room_id
                            console.log('currentroomReturn2', pathRoomId, currRoom)
                            traversalPath.push(way)
                            break;
                        }
                    }
                    console.log('pathroom', pathRoom)
                    previous = pathRoom;
                    trackIndex += 1
                    setTimeout(() => { backTrack() }, currRoom.cooldown * 1000);
                }

                return backTrack();
            }
            console.log('****----*** foundPath ****----***', foundPath)
            console.log('visited', visited)
            await startBackTrack();
            await sleep((currRoom.cooldown * (foundPath.length - 1)) * 1000)
            console.log('return outside finish', currRoom)
            // })

            // return


        }
        localStorage.setItem('visited', JSON.stringify(visited));

        let visitSize = Object.keys(visited).length
        let allSize = Object.keys(JSON.parse(localStorage.getItem('allVisited'))).length
        // console.log('sizes --- --- ---', visitSize, allSize)
        if (visitSize > allSize) {
            localStorage.setItem('allVisited', JSON.stringify(visited))
            allVisited = visited
        }

        currentRooms = visited;
        setTimeout(() => roomStep(), currRoom.cooldown * 1000);
    }
    roomStep()

    return visited;
};

export default traverse;