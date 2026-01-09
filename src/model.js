import initSqlJs from 'sql.js';

const DATABASE = [
    "PRAGMA foreign_keys = ON;",
    `CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
    );`,
    `CREATE TABLE project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
    );`,
    `CREATE TABLE projectUser (
    userId INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    isMember INTEGER NOT NULL DEFAULT 1,
    PRIMARY KEY (userId, projectId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    message TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE meeting (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    time DATETIME NOT NULL,
    place TEXT NOT NULL,
    projectId INTEGER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE userMeeting (
    userId INTEGER NOT NULL,
    meetingId INTEGER NOT NULL,
    accepted INTEGER,
    PRIMARY KEY (userId, meetingid),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (meetingid) REFERENCES meeting(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    value INTEGER NOT NULL
    );`,
    `CREATE TABLE task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    deadline DATETIME,
    projectId INTEGER NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (status) REFERENCES status(id)
    );`,
    `CREATE TABLE taskUser (
    userId INTEGER NOT NULL,
    taskId INTEGER NOT NULL,
    PRIMARY KEY (userId, taskId),
    FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (taskId) REFERENCES task(id) ON DELETE CASCADE
    );`,
]

const MOCK_DATA = {
    'user': [
        // [name, password]
        ['Joel', ''],
        ['Sawan', ''],
        ['Vanessa', ''],
        ['Mohamad', ''],
    ],
    'project': [
        // [name, description]
        ['HCI project', 'for the course DT137G',],
        ['Exam concert', 'rock and blues'],
        ['Final project ML', 'for Machine learning course'],
        ['Presentation', 'in the other course...'],
        ['Book review seminar', 'Discuss the book ...'],
    ],
    'task': [
        //name TEXT NOT NULL,
        //description TEXT,
        //deadline DATETIME, - YYYY-MM-DD HH:MI:SS
        //projectId INTEGER NOT NULL,
        //status INTEGER NOT NULL,
        ['Start view', '...', '2026-01-10 22:00:00', 1, 2],
        ['Project view', '...', '2026-01-10 23:59:59', 1, 1],
        ['Task board view', '...', '2026-01-10 23:59:59', 1, 1],
        ['Learn songs', 'Learn the keyboard parts of the songs', '2026-03-15 10:00:00', 2, 1],
        ['Read the book', 'Well, what are you waiting for?', '2026-02-24 11:00:00', 5, 2],
        ['Long term task', 'It could have been december', '2027-01-05 09:30:00', 4, 1],
        ['Longer term task', 'Let\'s see...', '2027-02-05 09:30:00', 4, 1],
    ],
    'meeting': [
        // [name, time, place, projectId]
        ['Prepare presentation', '2026-01-11 16:00:00', 'Discord', 1],
        ['Coding', '2026-01-10 20:00:00', 'Discord', 1],
    ],
    'status': [
        ['To do', 0],
        ['In progress', 1],
        ['Done', 5]
    ],
    'projectUser': [
        //[userId, projectId]
        [1, 1],
        [1, 2],
        [1, 3],
        [1, 5],
        [2, 1],
        [2, 5],
        [3, 1],
        [3, 5],
        [4, 1],
        [4, 5],
    ],
    'taskUser': [
        //[userId, taskId]
        [1, 1],
        [1, 2],
        [4, 2],
        [1, 4],
        [1, 5],
        [1, 6],
        [1, 7],
        [2, 5],
        [3, 5],
        [4, 5],
    ],
}

function sqlToJs(sq) {
    if (sq.length <= 0) { return [] };

    let l = [];
    let cols = sq[0].columns;
    function zipToObj(row) {
        let obj = {};
        cols.forEach((e, i) => { obj[e] = row[i]} );
        return obj;
    }
    sq[0].values.forEach(row => l.push(zipToObj(row)));
    return l;
}

function formatDate(date) {
    
}

class GroupProjectHelperModel {
    constructor(listener) {
        this.currentProject = null;
        this.observers = [listener];
        this.currentUser = { name: 'placeholder user', id: 1};
        this.dbReady = false;
    }
    
    // observer code
    addObserver(observer) {
        this.observers =[...this.observers, observer];
    }

    notifyObservers(payload) {
        function callObserverCallback(observer){
            try{
                observer(payload);
            }
            catch(err){
                console.error(err);
            }
        }

        this.observers.forEach(callObserverCallback);
    }
    
    // SQL database
    async setupDatabase() {
      // Load SQL.js
      const SQL = await initSqlJs({
        // Optional: Path to wasm file if not bundled
        locateFile: file => document.location.origin+`/database.wasm`
      });

      // Create in-memory database
      this.db = new SQL.Database();

      // Create a table
      DATABASE.forEach(s => this.db.run(s));
    }

    testDatabase() {
        MOCK_DATA.user.forEach(
            u => this.db.run(`INSERT INTO user (name, password) VALUES ("${u[0]}", "${u[1]}");`)
        );
        
        this.currentUser = sqlToJs(this.db.exec(`SELECT * FROM user WHERE name="${MOCK_DATA.user[0][0]}"`))[0];
    
        MOCK_DATA.project.forEach(
            p => this.db.run(`INSERT INTO project (name, description) VALUES ("${p[0]}", "${p[1]}");`)
        );
        
        MOCK_DATA.projectUser.forEach(
            pu => this.db.run( `INSERT INTO projectUser (userId, projectId) VALUES (${pu[0]}, ${pu[1]})`)
        );
        
        MOCK_DATA.status.forEach(
            s => this.db.run(`INSERT INTO status (name, value) VALUES ("${s[0]}", ${s[1]})`)
        );
        
        //let currentProject = this.db.exec(`SELECT * FROM project WHERE name = "${MOCK_DATA.project[0][0]}"`);
        //this.currentProject = sqlToJs(currentProject)[0];
        
        MOCK_DATA.task.forEach(
            t => this.db.run(
                `INSERT INTO task (name, description, deadline, projectId, status)
                 VALUES ("${t[0]}", "${t[1]}", "${t[2]}", ${t[3]}, ${t[4]});`
            )
        );

        MOCK_DATA.taskUser.forEach(
            tu => this.db.run(`INSERT INTO taskUser (userId, taskId) VALUES (${tu[0]}, ${tu[1]})`)
        );
        
        MOCK_DATA.meeting.forEach(
            (m, i) => {
                this.db.exec(`INSERT INTO meeting (name, time, place, projectId)
                    VALUES ("${m[0]}", "${m[1]}", "${m[2]}", ${m[3]})`)
                this._addUsersToMeeting(i + 1, m[3]);
            }
        );
        
        this.dbReady = true;
        
        //this.notifyObservers();
    }

    // getters
    getStatusID(name) {
        return this.db.exec(`SELECT id FROM status WHERE name="${name}"`);
    }

    getProjects() {
        return sqlToJs(this.db.exec(`SELECT * FROM project`));
    }
    
    getUserProjects() {
        return sqlToJs(this.db.exec(
            `SELECT * FROM project, projectUser
            WHERE id = projectId
            AND userId=${this.currentUser.id}
            ORDER BY name`
        ));
    }
    
    getCurrentProject() {
        return this.currentProject;
    }
    
    getProject(projectID) {
        //return this.projects.find(p => p.id == projectID);
        if (this.currentProject != null) { return {} }
        return this.currentProject;
    }
    
    getProjectTasks(projectID) {
        console.log( this.db.exec(`SELECT * FROM task WHERE projectId=${this.currentProject.id}`));
    }
    
    getTasksByDeadline() {
        return sqlToJs(this.db.exec(
            `SELECT task.id, task.name, deadline, project.name AS projectName, project.id AS projectId
            FROM task, project, taskUser
            WHERE task.projectId = project.id
            AND task.id = taskUser.taskId
            AND taskUser.userId = ${this.currentUser.id}
            ORDER BY deadline`)
        );
    }

    getProjectTasksByDeadline() {
        return sqlToJs(this.db.exec(
            `SELECT task.id, task.name, deadline, project.name AS projectName
            FROM task, project, taskUser
            WHERE task.projectId = project.id
            AND project.id=${this.currentProject.id}
            AND task.id = taskUser.taskId
            AND taskUser.userId = ${this.currentUser.id}
            ORDER BY deadline`));
    }
    
    getProjectMeetings() {
        if (this.currentProject == null) { return [] };
        return sqlToJs(this.db.exec(
            `SELECT id, name, time, place FROM meeting
            WHERE projectId = ${this.currentProject.id}
            ORDER BY time`)
        );
    }
    
    // setters
    setCurrentProject(id, force=false) {
        if (!this.currentProject || (force || id != this.currentProject.id)) {
            let newProject = this.db.exec(`SELECT * FROM project WHERE id = ${id}`);
            this.currentProject = sqlToJs(newProject)[0];
        }
    }
    
    createProject(details) {
        this.db.run(`INSERT INTO project (name, description)
            VALUES ("${details.name}", "${details.desc}")`);
        let projectId = sqlToJs(this.db.exec(`SELECT id FROM project
            WHERE name = "${details.name}"`))[0].id;

        this.db.run(`INSERT INTO projectUser (userId, projectId)
            VALUES (${this.currentUser.id}, ${projectId})`);
        
        this.setCurrentProject(projectId);
        this.notifyObservers();
    }
    
    updateProject(details) {
        const projectId = this.currentProject.id;
        this.db.run(`UPDATE project
            SET name = "${details.name}", description = "${details.desc}"
            WHERE id = ${projectId}`);
        this.setCurrentProject(projectId, true);
        //this.notifyObservers();
    }
   
    // name TEXT NOT NULL,
    // time DATETIME NOT NULL,
    // place TEXT NOT NULL,
    // projectId INTEGER NOT NULL,
    createMeeting(details) {
        this.db.run(`INSERT INTO meeting (name, time, place, projectId)
            VALUES ("${details.name}", "${details.time}", "${details.place}", ${this.currentProject.id})`
        );
        
        let meetingId = sqlToJs(this.db.exec(`SELECT id FROM meeting
            WHERE name = "${details.name}"`))[0].id;
        
        this._addUsersToMeeting(meetingId, this.currentProject.id);
    }
    
    _addUsersToMeeting(meetingId, projectId) {
        let users = sqlToJs(this.db.exec(`SELECT userId FROM projectUser
            WHERE projectId = ${projectId}
            AND isMember = 1`));
        
        users.forEach(u => this.db.run(
            `INSERT INTO userMeeting (userId, meetingId)
            VALUES (${u.userId}, ${meetingId})`)
        );
    }
}
export default GroupProjectHelperModel