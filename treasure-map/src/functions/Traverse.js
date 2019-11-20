function playerTravel() {
}
function traverse(room, currentRooms) {
    // console.log(room)
    currentRooms[room.room_id] = room
    console.log(currentRooms)
    //return currentRooms
    let traversalPath = []
    let visited = {}
    let currRoom = room
    visited[room.room_id] = {}
    for (let i = 0; i < room.exits.length; i++) {
        visited[room.room_id][room.exits[i]] = '?'
    }
    // loop until all rooms have been explored (all rooms added to visited)
    // change to 500
    while (visited.length !== 50) {
        // get the current room, id, and exits
        let roomId = currRoom.room_id
        let roomExits = currRoom.exits
        // create a list of unvisited rooms for the visited list
        let unvisited = []
        visited[roomId].forEach(element => {
            if (visited[roomId][element] == '?') {
                unvisited.push(element)
            }
        });
        console.log(unvisited)
        if (unvisited.length > 0) {
            // grab random unvisited room
            let nextDirectionIndex = Math.floor(Math.random() * (unvisited.length))
            let nextDirection = unvisited[nextDirectionIndex]
            // move to a new room
            currRoom = playerTravel(nextDirection)
            let nextRoomId = currRoom.room_id
            traversalPath.push(nextDirection)
            // set the previous room direction and new room direction accordingly
            visited[roomId][nextDirection] = nextRoomId;
            // if new room not visited add it to visited
            if (!(nextRoomId in visited)) {
                let nextExits = currRoom.exits
                visited[nextRoomId] = {}
                for (let i = 0; i < currRoom.exits.length; i++) {
                    visited[currRoom.room_id][currRoom.exits[i]] = '?'
                }
            }
            let reverseDirs = { "n": "s", "s": "n", "e": "w", "w": "e" }
            let reverseDir = reverseDirs[nextDirection]
            visited[nextRoomId][reverseDir] = roomId
        } else {
            // run a search to return to the nearest room with an unexplored direction

            //finish rest of while loop functiuonality
            let stack = []
            let visited_search = new Set()
            stack.push([roomId])
            let found = 0
            let foundPath = []

            while (stack.length > 0 && found === 0) {
                let reverseTraversal = []
                let path = stack.pop()
                let node = path[path.length - 1]
                let searchRoom = visited[node]
                if (!(node in visited_search)) {
                    visited_search.add(node)
                }

                for (let direction in searchRoom) {
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

                    if (searchRoom[direction] !== '?') {
                        let value = searchRoom[direction]
                        if (!(value in path)) {
                            exploredDirections.push(direction)
                        }
                    }
                }

                for (let direction in exploredDirections) {
                    reverseTraversal.push(direction)
                    new_path = [...path]
                    new_path.push(searchRoom[direction])
                    stack.push(new_path)
                }
            }
            let previous = foundPath[0]
            for (let pathRoom in foundPath) {
                if (pathRoom != foundPath[0]) {
                    for (let way in visited[previous]) {
                        if (visited[previous][way] == pathRoom) {
                            playerTravel(way)
                            traversalPath.push(way)
                        }
                    }
                }
                previous = pathRoom;
            }

        }
    }
}
    return traversalPath;
};

export default traverse;