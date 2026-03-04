// Real NHL players for all 32 teams (2024-25 season rosters)
// With real nationalities for every player

export interface RealPlayer {
  fn: string; // firstName
  ln: string; // lastName
  pos: string; // position: C, LW, RW, D, G
  num: number; // sweater number
  age: number;
  ovr: number;
  sal: number; // salary in millions
  nat: string; // nationality ISO code
}

export interface TeamData {
  abbrev: string;
  name: string;
  conference: string;
  division: string;
  color: string;
  players: RealPlayer[];
}

function p(fn: string, ln: string, pos: string, num: number, age: number, ovr: number, sal: number, nat: string): RealPlayer {
  return { fn, ln, pos, num, age, ovr, sal, nat };
}

export const NHL_TEAMS: TeamData[] = [
  {
    abbrev: 'ANA', name: 'Anaheim Ducks', conference: 'Western', division: 'Pacific', color: '#F47A38',
    players: [
      p('Trevor','Zegras','C',11,23,82,5.8,'USA'), p('Mason','McTavish','C',14,21,81,0.9,'CAN'),
      p('Leo','Carlsson','C',51,19,80,0.9,'SWE'), p('Troy','Terry','RW',19,26,83,5.5,'USA'),
      p('Frank','Vatrano','LW',77,30,80,3.7,'USA'), p('Alex','Killorn','LW',9,34,78,6.3,'CAN'),
      p('Brock','McGinn','LW',23,30,74,2.8,'CAN'), p('Ryan','Strome','C',16,31,79,5.0,'CAN'),
      p('Brett','Leason','RW',20,25,73,0.8,'CAN'), p('Isac','Lundestrom','C',21,24,76,3.0,'SWE'),
      p('Max','Jones','LW',49,25,73,1.5,'USA'), p('Cutter','Gauthier','C',36,21,76,0.9,'USA'),
      p('Ross','Johnston','LW',44,30,70,0.8,'CAN'),
      p('Cam','Fowler','D',4,32,82,6.5,'CAN'), p('Radko','Gudas','D',7,34,78,4.0,'CZE'),
      p('Pavel','Mintyukov','D',29,20,79,0.9,'RUS'), p('Olen','Zellweger','D',49,20,78,0.9,'CAN'),
      p('Jackson','LaCombe','D',92,22,75,0.9,'USA'), p('Brian','Dumoulin','D',24,32,74,1.1,'USA'),
      p('Drew','Helleson','D',43,22,74,0.9,'USA'),
      p('John','Gibson','G',36,31,83,6.4,'USA'), p('Lukas','Dostal','G',1,24,81,2.0,'CZE'),
    ]
  },
  {
    abbrev: 'BOS', name: 'Boston Bruins', conference: 'Eastern', division: 'Atlantic', color: '#FFB81C',
    players: [
      p('David','Pastrnak','RW',88,28,93,11.3,'CZE'), p('Brad','Marchand','LW',63,36,86,6.1,'CAN'),
      p('Pavel','Zacha','C',18,27,83,4.8,'CZE'), p('Charlie','Coyle','C',13,32,80,5.3,'USA'),
      p('Trent','Frederic','C',11,26,78,2.3,'USA'), p('Morgan','Geekie','C',39,26,77,2.0,'CAN'),
      p('Jake','DeBrusk','LW',74,27,82,5.5,'CAN'), p('Danton','Heinen','LW',43,28,76,2.5,'CAN'),
      p('Tyler','Johnson','C',90,33,74,0.8,'USA'), p('James','van Riemsdyk','LW',21,35,75,1.0,'USA'),
      p('Justin','Brazeau','RW',55,25,73,0.8,'CAN'), p('Johnny','Beecher','C',19,23,74,0.9,'USA'),
      p('Patrick','Brown','C',38,31,71,0.8,'USA'),
      p('Charlie','McAvoy','D',73,26,90,9.5,'USA'), p('Hampus','Lindholm','D',27,30,87,6.5,'SWE'),
      p('Brandon','Carlo','D',25,27,80,4.1,'USA'), p('Matt','Grzelcyk','D',48,30,78,3.7,'USA'),
      p('Mason','Lohrei','D',6,22,76,0.9,'USA'), p('Andrew','Peeke','D',52,26,74,2.8,'USA'),
      p('Kevin','Shattenkirk','D',12,35,74,1.1,'USA'),
      p('Jeremy','Swayman','G',1,25,88,3.5,'USA'), p('Linus','Ullmark','G',35,30,87,5.0,'SWE'),
    ]
  },
  {
    abbrev: 'BUF', name: 'Buffalo Sabres', conference: 'Eastern', division: 'Atlantic', color: '#002654',
    players: [
      p('Tage','Thompson','C',72,26,88,7.1,'USA'), p('Dylan','Cozens','C',24,23,84,7.1,'CAN'),
      p('Alex','Tuch','RW',89,28,85,5.3,'USA'), p('J.J.','Peterka','RW',77,22,82,0.9,'DEU'),
      p('Jeff','Skinner','LW',53,31,82,9.0,'CAN'), p('Jack','Quinn','RW',22,22,80,0.9,'CAN'),
      p('Zach','Benson','LW',9,19,78,0.9,'CAN'), p('Jordan','Greenway','LW',12,27,76,3.0,'USA'),
      p('Tyson','Jost','C',17,25,74,2.0,'CAN'), p('Peyton','Krebs','C',19,23,75,0.9,'CAN'),
      p('Kyle','Okposo','RW',21,35,73,6.0,'USA'), p('Zemgus','Girgensons','LW',28,30,74,2.2,'LVA'),
      p('Victor','Olofsson','LW',68,28,77,4.8,'SWE'),
      p('Rasmus','Dahlin','D',26,24,91,10.9,'SWE'), p('Owen','Power','D',25,21,84,0.9,'CAN'),
      p('Mattias','Samuelsson','D',23,23,79,4.0,'USA'), p('Bowen','Byram','D',4,22,78,3.8,'CAN'),
      p('Henri','Jokiharju','D',10,24,76,3.0,'FIN'), p('Connor','Clifton','D',75,28,73,3.3,'USA'),
      p('Jacob','Bryson','D',78,26,72,1.9,'CAN'),
      p('Ukko-Pekka','Luukkonen','G',1,25,82,0.8,'FIN'), p('Devon','Levi','G',27,22,78,0.9,'CAN'),
    ]
  },
  {
    abbrev: 'CGY', name: 'Calgary Flames', conference: 'Western', division: 'Pacific', color: '#D2001C',
    players: [
      p('Nazem','Kadri','C',91,33,84,7.0,'CAN'), p('Mikael','Backlund','C',11,35,79,5.4,'SWE'),
      p('Jonathan','Huberdeau','LW',10,30,83,10.5,'CAN'), p('Andrew','Mangiapane','LW',88,28,80,5.8,'CAN'),
      p('Blake','Coleman','LW',20,32,79,4.9,'USA'), p('Yegor','Sharangovich','RW',17,25,80,2.7,'BLR'),
      p('Matt','Coronato','RW',28,21,78,0.9,'USA'), p('Connor','Zary','C',18,23,77,0.9,'CAN'),
      p('Walker','Duehr','RW',71,25,72,0.8,'USA'), p('Martin','Pospisil','C',76,24,74,0.8,'SVK'),
      p('Adam','Ruzicka','C',63,25,74,1.1,'SVK'), p('Kevin','Rooney','C',21,30,71,0.8,'USA'),
      p('Jakob','Pelletier','LW',49,23,74,0.9,'CAN'),
      p('Rasmus','Andersson','D',4,27,84,4.6,'SWE'), p('MacKenzie','Weegar','D',52,30,85,6.3,'CAN'),
      p('Chris','Tanev','D',8,34,82,4.5,'CAN'), p('Nikita','Okhotiuk','D',57,24,73,0.8,'RUS'),
      p('Daniil','Miromanov','D',62,26,73,0.8,'RUS'), p('Kevin','Bahl','D',88,24,74,0.9,'CAN'),
      p('Tyson','Barrie','D',22,33,77,4.5,'CAN'),
      p('Jacob','Markstrom','G',25,34,85,6.0,'SWE'), p('Dan','Vladar','G',80,26,78,2.2,'CZE'),
    ]
  },
  {
    abbrev: 'CAR', name: 'Carolina Hurricanes', conference: 'Eastern', division: 'Metropolitan', color: '#CC0000',
    players: [
      p('Sebastian','Aho','C',20,27,91,8.5,'FIN'), p('Andrei','Svechnikov','RW',37,24,88,7.8,'RUS'),
      p('Seth','Jarvis','RW',24,22,84,3.8,'CAN'), p('Jesperi','Kotkaniemi','C',82,24,78,4.8,'FIN'),
      p('Martin','Necas','C',88,25,86,3.0,'CZE'), p('Jordan','Staal','C',11,35,80,6.0,'CAN'),
      p('Teuvo','Teravainen','LW',86,30,82,5.4,'FIN'), p('Jack','Roslovic','C',96,27,78,2.8,'USA'),
      p('Jordan','Martinook','LW',48,31,74,1.8,'CAN'), p('Stefan','Noesen','RW',23,30,76,1.0,'USA'),
      p('Michael','Bunting','LW',58,28,78,4.5,'CAN'), p('William','Carrier','LW',28,29,73,1.4,'CAN'),
      p('Brendan','Lemieux','LW',48,28,70,1.0,'CAN'),
      p('Jaccob','Slavin','D',74,30,89,5.3,'USA'), p('Brent','Burns','D',8,39,83,5.3,'CAN'),
      p('Brett','Pesce','D',22,29,84,4.0,'USA'), p('Brady','Skjei','D',76,30,82,5.4,'USA'),
      p('Dmitry','Orlov','D',7,32,82,7.7,'RUS'), p('Jalen','Chatfield','D',5,27,77,2.3,'CAN'),
      p('Calvin','de Haan','D',44,33,73,0.9,'CAN'),
      p('Frederik','Andersen','G',31,34,85,4.5,'DNK'), p('Pyotr','Kochetkov','G',52,25,83,2.0,'RUS'),
    ]
  },
  {
    abbrev: 'CHI', name: 'Chicago Blackhawks', conference: 'Western', division: 'Central', color: '#CF0A2C',
    players: [
      p('Connor','Bedard','C',98,19,87,0.95,'CAN'), p('Philipp','Kurashev','C',23,24,78,2.6,'CHE'),
      p('Tyler','Johnson','C',90,33,76,2.0,'USA'), p('Taylor','Hall','LW',4,32,80,6.0,'CAN'),
      p('Nick','Foligno','LW',17,36,74,3.8,'USA'), p('Boris','Katchouk','LW',14,26,73,0.8,'CAN'),
      p('Lukas','Reichel','LW',27,22,76,0.9,'DEU'), p('Andreas','Athanasiou','LW',89,29,76,3.0,'CAN'),
      p('MacKenzie','Entwistle','C',58,24,72,0.8,'CAN'), p('Colin','Blackwell','C',43,31,73,1.5,'USA'),
      p('Joey','Anderson','RW',15,25,72,0.8,'USA'), p('Ryan','Donato','C',16,28,76,1.5,'USA'),
      p('Corey','Perry','RW',94,38,72,1.0,'CAN'),
      p('Seth','Jones','D',4,29,84,9.5,'USA'), p('Alex','Vlasic','D',43,21,81,0.9,'USA'),
      p('Connor','Murphy','D',5,31,79,4.4,'USA'), p('Jarred','Tinordi','D',44,31,69,0.9,'USA'),
      p('Kevin','Korchinski','D',55,20,76,0.9,'CAN'), p('Wyatt','Kaiser','D',44,22,74,0.9,'USA'),
      p('Nikita','Zaitsev','D',22,32,72,1.5,'RUS'),
      p('Petr','Mrazek','G',34,32,79,3.8,'CZE'), p('Arvid','Soderblom','G',40,24,76,0.8,'SWE'),
    ]
  },
  {
    abbrev: 'COL', name: 'Colorado Avalanche', conference: 'Western', division: 'Central', color: '#6F263D',
    players: [
      p('Nathan','MacKinnon','C',29,29,96,12.6,'CAN'), p('Mikko','Rantanen','RW',96,27,93,9.3,'FIN'),
      p('Artturi','Lehkonen','LW',62,28,84,4.5,'FIN'), p('Valeri','Nichushkin','RW',13,29,86,6.1,'RUS'),
      p('Casey','Mittelstadt','C',37,25,80,3.6,'USA'), p('Ross','Colton','C',20,27,78,4.0,'USA'),
      p('Logan','OConnor','RW',25,27,76,2.0,'USA'), p('Jonathan','Drouin','LW',27,29,79,1.0,'CAN'),
      p('Andrew','Cogliano','LW',11,37,71,1.0,'CAN'), p('Miles','Wood','LW',44,28,76,3.0,'USA'),
      p('Joel','Kiviranta','LW',94,28,73,0.8,'FIN'), p('Ivan','Ivan','C',72,22,73,0.9,'CZE'),
      p('Parker','Kelly','C',47,25,71,0.8,'CAN'),
      p('Cale','Makar','D',8,25,96,9.0,'CAN'), p('Devon','Toews','D',7,30,87,4.1,'CAN'),
      p('Samuel','Girard','D',49,25,81,5.0,'CAN'), p('Josh','Manson','D',42,32,79,4.5,'CAN'),
      p('Oliver','Kylington','D',58,27,76,1.0,'SWE'), p('Jack','Johnson','D',3,37,72,0.8,'USA'),
      p('Sam','Malinski','D',72,23,73,0.8,'USA'),
      p('Alexandar','Georgiev','G',40,28,83,3.4,'BGR'), p('Justus','Annunen','G',60,24,78,0.8,'FIN'),
    ]
  },
  {
    abbrev: 'CBJ', name: 'Columbus Blue Jackets', conference: 'Eastern', division: 'Metropolitan', color: '#002654',
    players: [
      p('Patrik','Laine','RW',29,26,86,8.7,'FIN'), p('Johnny','Gaudreau','LW',13,30,88,9.8,'USA'),
      p('Boone','Jenner','C',38,31,80,3.8,'CAN'), p('Cole','Sillinger','C',34,21,78,0.9,'CAN'),
      p('Kent','Johnson','C',91,21,79,0.9,'CAN'), p('Adam','Fantilli','C',11,19,80,0.9,'CAN'),
      p('Kirill','Marchenko','RW',86,23,80,0.9,'RUS'), p('Yegor','Chinakhov','RW',59,23,77,0.9,'RUS'),
      p('Sean','Kuraly','C',7,30,74,4.0,'USA'), p('Alexander','Nylander','RW',15,25,74,1.0,'SWE'),
      p('Liam','Foudy','LW',19,24,72,0.8,'CAN'), p('Justin','Danforth','RW',17,30,72,0.8,'CAN'),
      p('Mathieu','Olivier','RW',24,28,71,0.8,'CAN'),
      p('Zach','Werenski','D',8,27,87,9.6,'USA'), p('Ivan','Provorov','D',9,27,80,6.8,'RUS'),
      p('Jake','Christiansen','D',55,23,74,0.8,'CAN'), p('Andrew','Peeke','D',2,26,74,2.8,'USA'),
      p('Damon','Severson','D',78,29,80,6.0,'CAN'), p('Erik','Gudbranson','D',44,32,74,4.0,'CAN'),
      p('David','Jiricek','D',55,20,78,0.9,'CZE'),
      p('Elvis','Merzlikins','G',90,30,82,5.4,'LVA'), p('Daniil','Tarasov','G',40,24,78,0.8,'RUS'),
    ]
  },
  {
    abbrev: 'DAL', name: 'Dallas Stars', conference: 'Western', division: 'Central', color: '#006847',
    players: [
      p('Jason','Robertson','LW',21,25,92,7.8,'USA'), p('Roope','Hintz','C',24,27,88,8.5,'FIN'),
      p('Joe','Pavelski','C',16,40,82,5.5,'USA'), p('Tyler','Seguin','C',91,32,84,9.9,'CAN'),
      p('Jamie','Benn','LW',14,35,82,9.5,'CAN'), p('Wyatt','Johnston','C',53,21,82,0.9,'CAN'),
      p('Mason','Marchment','LW',27,29,82,4.5,'CAN'), p('Matt','Duchene','C',95,33,80,3.0,'CAN'),
      p('Ty','Dellandrea','C',10,23,76,1.3,'CAN'), p('Evgenii','Dadonov','RW',63,35,75,1.5,'RUS'),
      p('Logan','Stankoven','C',11,21,79,0.9,'CAN'), p('Radek','Faksa','C',12,30,75,3.3,'CZE'),
      p('Sam','Steel','C',18,26,73,0.8,'CAN'),
      p('Miro','Heiskanen','D',4,25,92,8.5,'FIN'), p('Ryan','Suter','D',20,39,79,3.6,'USA'),
      p('Esa','Lindell','D',23,30,83,5.8,'FIN'), p('Thomas','Harley','D',55,23,80,1.5,'CAN'),
      p('Nils','Lundkvist','D',5,24,77,1.5,'SWE'), p('Jani','Hakanpaa','D',2,32,76,1.5,'FIN'),
      p('Colin','Miller','D',6,31,74,1.8,'CAN'),
      p('Jake','Oettinger','G',29,25,87,4.0,'USA'), p('Scott','Wedgewood','G',41,31,76,1.0,'CAN'),
    ]
  },
  {
    abbrev: 'DET', name: 'Detroit Red Wings', conference: 'Eastern', division: 'Atlantic', color: '#CE1126',
    players: [
      p('Dylan','Larkin','C',71,27,87,8.7,'USA'), p('Lucas','Raymond','LW',23,22,85,6.4,'SWE'),
      p('Alex','DeBrincat','LW',12,26,86,7.9,'USA'), p('Patrick','Kane','RW',88,35,83,2.8,'USA'),
      p('Andrew','Copp','C',18,29,79,5.6,'USA'), p('Michael','Rasmussen','C',27,24,77,1.5,'CAN'),
      p('Robby','Fabbri','C',14,28,76,4.0,'CAN'), p('Joe','Veleno','C',90,24,77,2.3,'CAN'),
      p('Daniel','Sprong','RW',17,27,76,0.9,'NLD'), p('J.T.','Compher','C',37,29,78,5.1,'USA'),
      p('David','Perron','LW',57,36,80,4.8,'CAN'), p('Jonatan','Berggren','LW',52,23,76,0.9,'SWE'),
      p('Adam','Erne','LW',73,28,72,2.1,'USA'),
      p('Moritz','Seider','D',53,23,87,3.5,'DEU'), p('Ben','Chiarot','D',8,33,77,4.8,'CAN'),
      p('Jake','Walman','D',96,28,79,3.4,'CAN'), p('Jeff','Petry','D',46,36,77,6.3,'USA'),
      p('Olli','Maatta','D',2,29,75,3.0,'FIN'), p('Simon','Edvinsson','D',3,21,78,0.9,'SWE'),
      p('Justin','Holl','D',3,32,73,2.0,'USA'),
      p('Ville','Husso','G',35,29,80,4.8,'FIN'), p('Alex','Lyon','G',34,31,78,0.9,'USA'),
    ]
  },
  {
    abbrev: 'EDM', name: 'Edmonton Oilers', conference: 'Western', division: 'Pacific', color: '#041E42',
    players: [
      p('Connor','McDavid','C',97,27,99,12.5,'CAN'), p('Leon','Draisaitl','C',29,28,95,8.5,'DEU'),
      p('Zach','Hyman','LW',18,32,87,5.5,'CAN'), p('Ryan','Nugent-Hopkins','C',93,31,86,5.1,'CAN'),
      p('Evander','Kane','LW',91,32,84,5.1,'CAN'), p('Connor','Brown','RW',28,30,77,3.6,'CAN'),
      p('Warren','Foegele','LW',37,28,77,2.8,'CAN'), p('Sam','Gagner','C',89,34,74,0.9,'CAN'),
      p('Mattias','Janmark','C',13,31,75,1.4,'SWE'), p('Derek','Ryan','C',10,37,73,1.0,'USA'),
      p('Ryan','McLeod','C',71,24,76,1.5,'CAN'), p('Dylan','Holloway','LW',55,23,77,0.9,'CAN'),
      p('Adam','Henrique','C',19,34,76,2.0,'CAN'),
      p('Evan','Bouchard','D',2,24,87,3.9,'CAN'), p('Darnell','Nurse','D',25,29,84,9.3,'CAN'),
      p('Mattias','Ekholm','D',14,34,85,6.3,'SWE'), p('Brett','Kulak','D',27,30,79,2.8,'CAN'),
      p('Cody','Ceci','D',5,30,77,3.3,'CAN'), p('Philip','Broberg','D',86,23,77,0.9,'SWE'),
      p('Vincent','Desharnais','D',73,27,74,0.8,'CAN'),
      p('Stuart','Skinner','G',74,25,83,2.6,'CAN'), p('Jack','Campbell','G',36,32,76,5.0,'USA'),
    ]
  },
  {
    abbrev: 'FLA', name: 'Florida Panthers', conference: 'Eastern', division: 'Atlantic', color: '#041E42',
    players: [
      p('Aleksander','Barkov','C',16,29,93,10.0,'FIN'), p('Matthew','Tkachuk','LW',19,26,93,9.5,'USA'),
      p('Sam','Reinhart','C',13,28,89,6.5,'CAN'), p('Carter','Verhaeghe','LW',23,29,85,4.2,'CAN'),
      p('Sam','Bennett','C',9,28,83,4.4,'CAN'), p('Anton','Lundell','C',15,22,80,2.0,'FIN'),
      p('Eetu','Luostarinen','C',27,25,76,1.7,'FIN'), p('Kevin','Stenlund','C',44,27,73,0.8,'SWE'),
      p('Evan','Rodrigues','C',17,30,78,2.0,'CAN'), p('Ryan','Lomberg','LW',94,29,72,0.9,'CAN'),
      p('Nick','Cousins','C',21,30,72,1.0,'CAN'), p('Steven','Lorentz','C',18,28,72,0.8,'CAN'),
      p('Jonah','Gadjovich','LW',44,25,71,0.8,'CAN'),
      p('Aaron','Ekblad','D',5,28,86,7.5,'CAN'), p('Gustav','Forsling','D',42,28,87,3.2,'SWE'),
      p('Brandon','Montour','D',62,30,85,3.5,'CAN'), p('Oliver','Ekman-Larsson','D',23,33,79,7.3,'SWE'),
      p('Dmitry','Kulikov','D',7,33,75,2.2,'RUS'), p('Niko','Mikkola','D',77,28,74,1.5,'FIN'),
      p('Josh','Mahura','D',28,25,73,0.8,'CAN'),
      p('Sergei','Bobrovsky','G',72,35,87,10.0,'RUS'), p('Anthony','Stolarz','G',41,30,81,0.9,'USA'),
    ]
  },
  {
    abbrev: 'LAK', name: 'Los Angeles Kings', conference: 'Western', division: 'Pacific', color: '#111111',
    players: [
      p('Anze','Kopitar','C',11,37,86,10.0,'SVN'), p('Adrian','Kempe','LW',9,27,86,5.5,'SWE'),
      p('Kevin','Fiala','LW',22,27,86,7.9,'CHE'), p('Quinton','Byfield','C',55,21,82,0.9,'CAN'),
      p('Phillip','Danault','C',24,31,82,5.5,'CAN'), p('Viktor','Arvidsson','RW',33,31,80,4.3,'SWE'),
      p('Pierre-Luc','Dubois','C',80,26,80,8.5,'CAN'), p('Alex','Laferriere','RW',78,22,76,0.9,'USA'),
      p('Gabriel','Vilardi','C',13,24,80,3.5,'CAN'), p('Brendan','Lemieux','LW',48,28,72,1.0,'CAN'),
      p('Blake','Lizotte','C',46,26,74,1.3,'USA'), p('Trevor','Lewis','C',22,37,71,0.8,'USA'),
      p('Arthur','Kaliyev','RW',34,23,76,0.9,'USA'),
      p('Drew','Doughty','D',8,34,85,11.0,'CAN'), p('Mikey','Anderson','D',44,24,80,4.2,'USA'),
      p('Matt','Roy','D',3,29,80,3.2,'USA'), p('Vladislav','Gavrikov','D',84,28,81,5.4,'RUS'),
      p('Sean','Walker','D',26,29,76,2.7,'USA'), p('Andreas','Englund','D',5,27,73,0.8,'SWE'),
      p('Tobias','Bjornfot','D',33,23,74,0.9,'SWE'),
      p('Cam','Talbot','G',39,36,80,3.5,'CAN'), p('David','Rittich','G',33,31,76,1.0,'CZE'),
    ]
  },
  {
    abbrev: 'MIN', name: 'Minnesota Wild', conference: 'Western', division: 'Central', color: '#154734',
    players: [
      p('Kirill','Kaprizov','LW',97,27,94,9.0,'RUS'), p('Matt','Boldy','LW',12,22,85,3.9,'USA'),
      p('Joel','Eriksson Ek','C',14,27,84,5.3,'SWE'), p('Marco','Rossi','C',23,22,80,0.9,'AUT'),
      p('Ryan','Hartman','RW',38,29,78,1.7,'USA'), p('Mats','Zuccarello','RW',36,37,83,6.0,'NOR'),
      p('Frederick','Gaudreau','C',89,30,76,2.5,'CAN'), p('Marcus','Johansson','LW',90,33,77,3.0,'SWE'),
      p('Connor','Dewar','C',26,24,73,0.9,'CAN'), p('Sam','Steel','C',13,26,74,0.8,'CAN'),
      p('Mason','Shaw','LW',15,25,73,0.8,'CAN'), p('Adam','Beckman','LW',53,22,73,0.9,'CAN'),
      p('Brandon','Duhaime','RW',21,27,72,0.9,'USA'),
      p('Jared','Spurgeon','D',46,34,84,7.6,'CAN'), p('Jonas','Brodin','D',25,30,84,6.0,'SWE'),
      p('Jake','Middleton','D',5,28,78,2.4,'CAN'), p('Brock','Faber','D',7,21,81,0.9,'USA'),
      p('Calen','Addison','D',2,24,76,0.9,'CAN'), p('Jon','Merrill','D',4,32,73,1.2,'USA'),
      p('Alex','Goligoski','D',33,38,72,1.0,'USA'),
      p('Filip','Gustavsson','G',32,26,85,3.8,'SWE'), p('Marc-Andre','Fleury','G',29,39,80,3.5,'CAN'),
    ]
  },
  {
    abbrev: 'MTL', name: 'Montréal Canadiens', conference: 'Eastern', division: 'Atlantic', color: '#AF1E2D',
    players: [
      p('Nick','Suzuki','C',14,24,87,7.9,'CAN'), p('Cole','Caufield','RW',22,23,86,7.9,'USA'),
      p('Juraj','Slafkovsky','LW',20,20,81,0.9,'SVK'), p('Kirby','Dach','C',77,23,79,3.4,'CAN'),
      p('Alex','Newhook','C',15,23,78,2.9,'CAN'), p('Josh','Anderson','RW',17,29,78,5.5,'CAN'),
      p('Brendan','Gallagher','RW',11,32,76,6.5,'CAN'), p('Christian','Dvorak','C',28,28,76,4.5,'USA'),
      p('Joel','Armia','RW',40,31,75,3.4,'FIN'), p('Jake','Evans','C',71,27,74,1.7,'CAN'),
      p('Jesse','Ylonen','RW',56,24,73,0.8,'FIN'), p('Rafael','Harvey-Pinard','LW',49,25,73,0.8,'CAN'),
      p('Michael','Pezzetta','C',55,26,70,0.8,'CAN'),
      p('Mike','Matheson','D',8,30,81,4.9,'CAN'), p('David','Savard','D',58,33,76,3.5,'CAN'),
      p('Kaiden','Guhle','D',21,22,80,0.9,'CAN'), p('Jordan','Harris','D',54,24,76,0.8,'USA'),
      p('Arber','Xhekaj','D',72,23,78,0.9,'CAN'), p('Johnathan','Kovacevic','D',26,26,74,0.8,'CAN'),
      p('Justin','Barron','D',52,22,74,0.9,'CAN'),
      p('Sam','Montembeault','G',35,27,80,3.2,'CAN'), p('Cayden','Primeau','G',30,24,75,0.9,'USA'),
    ]
  },
  {
    abbrev: 'NSH', name: 'Nashville Predators', conference: 'Western', division: 'Central', color: '#FFB81C',
    players: [
      p('Filip','Forsberg','LW',9,30,91,8.5,'SWE'), p('Roman','Josi','D',59,34,93,9.1,'CHE'),
      p('Ryan','OReilly','C',90,33,83,4.5,'CAN'), p('Gustav','Nyquist','LW',14,34,78,5.5,'SWE'),
      p('Tommy','Novak','C',82,27,78,2.3,'USA'), p('Luke','Evangelista','RW',77,22,78,0.9,'CAN'),
      p('Colton','Sissons','C',10,30,75,2.9,'CAN'), p('Cody','Glass','C',8,25,76,1.6,'CAN'),
      p('Yakov','Trenin','LW',13,27,75,1.7,'RUS'), p('Cole','Smith','LW',36,29,71,0.8,'USA'),
      p('Mark','Jankowski','C',17,29,72,0.8,'CAN'), p('Michael','McCarron','C',47,29,71,0.8,'USA'),
      p('Kiefer','Sherwood','RW',44,29,74,0.8,'USA'),
      p('Alexandre','Carrier','D',45,27,80,1.4,'CAN'),
      p('Jeremy','Lauzon','D',3,27,76,2.0,'CAN'), p('Tyson','Barrie','D',22,33,78,4.5,'CAN'),
      p('Luke','Schenn','D',2,34,76,0.9,'CAN'), p('Dante','Fabbro','D',57,25,76,3.0,'CAN'),
      p('Kevin','Gravel','D',5,31,71,0.8,'USA'),
      p('Juuse','Saros','G',74,29,89,5.0,'FIN'), p('Kevin','Lankinen','G',32,29,78,1.3,'FIN'),
    ]
  },
  {
    abbrev: 'NJD', name: 'New Jersey Devils', conference: 'Eastern', division: 'Metropolitan', color: '#CE1126',
    players: [
      p('Jack','Hughes','C',86,23,92,8.0,'USA'), p('Nico','Hischier','C',13,25,87,7.3,'CHE'),
      p('Jesper','Bratt','LW',63,25,88,5.5,'SWE'), p('Dawson','Mercer','C',91,22,81,1.8,'CAN'),
      p('Tomas','Tatar','LW',90,33,78,4.6,'SVK'), p('Ondrej','Palat','LW',18,33,79,6.0,'CZE'),
      p('Erik','Haula','C',56,33,77,2.8,'FIN'), p('Tyler','Toffoli','RW',73,32,82,4.3,'CAN'),
      p('Curtis','Lazar','C',42,29,72,1.0,'CAN'), p('Nathan','Bastian','RW',14,28,73,1.5,'CAN'),
      p('Miles','Wood','LW',44,28,76,3.5,'USA'), p('Michael','McLeod','C',20,25,73,1.0,'CAN'),
      p('Yegor','Sharangovich','RW',17,25,80,2.8,'BLR'),
      p('Dougie','Hamilton','D',7,31,88,9.0,'CAN'), p('Jonas','Siegenthaler','D',71,27,80,3.4,'CHE'),
      p('John','Marino','D',6,27,79,4.4,'USA'), p('Luke','Hughes','D',43,21,83,0.9,'USA'),
      p('Simon','Nemec','D',26,20,78,0.9,'SVK'), p('Ryan','Graves','D',33,29,78,4.5,'CAN'),
      p('Brendan','Smith','D',2,35,71,0.8,'CAN'),
      p('Vitek','Vanecek','G',41,28,80,3.4,'CZE'), p('Akira','Schmid','G',40,24,78,0.8,'CHE'),
    ]
  },
  {
    abbrev: 'NYI', name: 'New York Islanders', conference: 'Eastern', division: 'Metropolitan', color: '#00539B',
    players: [
      p('Mathew','Barzal','C',13,27,88,7.0,'CAN'), p('Bo','Horvat','C',14,29,86,8.5,'CAN'),
      p('Brock','Nelson','C',29,32,84,6.0,'USA'), p('Anders','Lee','LW',27,33,82,7.0,'USA'),
      p('Kyle','Palmieri','RW',21,33,80,5.0,'USA'), p('Jean-Gabriel','Pageau','C',44,31,79,5.0,'CAN'),
      p('Simon','Holmstrom','RW',15,22,76,0.9,'SWE'), p('Pierre','Engvall','LW',18,28,77,3.0,'SWE'),
      p('Casey','Cizikas','C',53,33,75,2.5,'CAN'), p('Matt','Martin','LW',17,35,70,0.8,'CAN'),
      p('Hudson','Fasching','RW',20,28,73,0.8,'USA'), p('Oliver','Wahlstrom','RW',26,24,75,1.8,'USA'),
      p('Cal','Clutterbuck','RW',15,36,72,3.5,'CAN'),
      p('Ryan','Pulock','D',6,29,83,6.2,'CAN'), p('Noah','Dobson','D',8,24,85,4.0,'CAN'),
      p('Adam','Pelech','D',3,29,84,5.8,'CAN'), p('Scott','Mayfield','D',24,31,79,5.3,'USA'),
      p('Alexander','Romanov','D',28,24,79,2.5,'RUS'), p('Sebastian','Aho','D',25,28,75,0.9,'SWE'),
      p('Dennis','Cholowski','D',21,26,72,0.8,'CAN'),
      p('Ilya','Sorokin','G',30,29,88,4.0,'RUS'), p('Semyon','Varlamov','G',40,36,81,4.0,'RUS'),
    ]
  },
  {
    abbrev: 'NYR', name: 'New York Rangers', conference: 'Eastern', division: 'Metropolitan', color: '#0038A8',
    players: [
      p('Artemi','Panarin','LW',10,32,93,11.6,'RUS'), p('Mika','Zibanejad','C',93,31,88,8.5,'SWE'),
      p('Chris','Kreider','LW',20,33,85,6.5,'USA'), p('Vincent','Trocheck','C',16,31,85,5.6,'USA'),
      p('Alexis','Lafreniere','LW',13,22,83,2.1,'CAN'), p('Kaapo','Kakko','RW',24,23,79,2.1,'FIN'),
      p('Filip','Chytil','C',72,24,80,4.4,'CZE'), p('Barclay','Goodrow','C',21,31,76,3.6,'CAN'),
      p('Tyler','Motte','RW',14,29,73,1.4,'USA'), p('Will','Cuylle','LW',50,22,75,0.9,'CAN'),
      p('Jimmy','Vesey','LW',26,31,74,0.8,'USA'), p('Nick','Bonino','C',28,36,73,0.8,'USA'),
      p('Matt','Rempe','C',73,22,72,0.8,'CAN'),
      p('Adam','Fox','D',23,26,93,9.5,'USA'), p('K\'Andre','Miller','D',79,24,84,3.9,'USA'),
      p('Jacob','Trouba','D',8,30,82,8.0,'USA'), p('Ryan','Lindgren','D',55,26,80,3.0,'USA'),
      p('Braden','Schneider','D',4,23,78,0.9,'CAN'), p('Erik','Gustafsson','D',56,32,75,0.8,'SWE'),
      p('Chad','Ruhwedel','D',2,34,71,0.8,'USA'),
      p('Igor','Shesterkin','G',31,28,94,5.7,'RUS'), p('Jonathan','Quick','G',32,38,79,1.3,'USA'),
    ]
  },
  {
    abbrev: 'OTT', name: 'Ottawa Senators', conference: 'Eastern', division: 'Atlantic', color: '#C52032',
    players: [
      p('Brady','Tkachuk','LW',7,25,89,8.2,'USA'), p('Tim','Stutzle','C',18,22,88,8.4,'DEU'),
      p('Claude','Giroux','RW',28,36,82,6.5,'CAN'), p('Drake','Batherson','RW',19,25,84,5.0,'CAN'),
      p('Josh','Norris','C',9,25,82,8.0,'USA'), p('Shane','Pinto','C',57,23,79,2.0,'USA'),
      p('Ridly','Greig','C',71,22,77,0.9,'CAN'), p('Dominik','Kubalik','LW',81,29,78,2.5,'CZE'),
      p('Parker','Kelly','C',45,25,72,0.8,'CAN'), p('Vladimir','Tarasenko','RW',91,32,82,4.8,'RUS'),
      p('Mark','Kastelic','C',47,25,73,0.8,'CAN'), p('Mathieu','Joseph','RW',21,27,77,2.9,'CAN'),
      p('Tyler','Motte','RW',14,29,73,1.0,'USA'),
      p('Thomas','Chabot','D',72,27,87,8.0,'CAN'), p('Jake','Sanderson','D',85,22,84,0.9,'USA'),
      p('Artem','Zub','D',2,28,80,4.6,'RUS'), p('Travis','Hamonic','D',3,33,75,1.1,'CAN'),
      p('Erik','Brannstrom','D',26,24,75,1.5,'SWE'), p('Jacob','Bernard-Docker','D',45,23,74,0.9,'CAN'),
      p('Nick','Jensen','D',79,33,74,2.5,'USA'),
      p('Linus','Ullmark','G',35,31,87,5.0,'SWE'), p('Anton','Forsberg','G',31,31,78,2.8,'SWE'),
    ]
  },
  {
    abbrev: 'PHI', name: 'Philadelphia Flyers', conference: 'Eastern', division: 'Metropolitan', color: '#F74902',
    players: [
      p('Travis','Konecny','RW',11,27,87,5.5,'CAN'), p('Sean','Couturier','C',14,31,82,7.8,'CAN'),
      p('Owen','Tippett','RW',74,25,81,3.5,'CAN'), p('Tyson','Foerster','RW',71,22,78,0.9,'CAN'),
      p('Joel','Farabee','LW',86,24,80,5.0,'USA'), p('Morgan','Frost','C',48,25,78,3.3,'CAN'),
      p('Scott','Laughton','C',21,30,77,3.0,'CAN'), p('Bobby','Brink','RW',10,23,76,0.9,'USA'),
      p('Noah','Cates','LW',49,25,76,0.8,'USA'), p('Ryan','Poehling','C',25,25,74,1.6,'USA'),
      p('Nicolas','Deslauriers','LW',44,33,70,0.8,'CAN'), p('Garnet','Hathaway','RW',19,32,73,2.0,'USA'),
      p('Max','Willman','LW',17,28,70,0.8,'USA'),
      p('Travis','Sanheim','D',6,28,83,6.3,'CAN'), p('Ivan','Provorov','D',9,27,80,6.8,'RUS'),
      p('Cam','York','D',45,23,79,1.4,'USA'), p('Rasmus','Ristolainen','D',55,29,76,5.1,'FIN'),
      p('Nick','Seeler','D',24,30,74,1.7,'USA'), p('Marc','Staal','D',18,37,72,0.8,'CAN'),
      p('Egor','Zamula','D',56,24,73,0.8,'RUS'),
      p('Carter','Hart','G',79,25,83,3.98,'CAN'), p('Sam','Ersson','G',33,24,80,0.9,'SWE'),
    ]
  },
  {
    abbrev: 'PIT', name: 'Pittsburgh Penguins', conference: 'Eastern', division: 'Metropolitan', color: '#FCB514',
    players: [
      p('Sidney','Crosby','C',87,37,92,8.7,'CAN'), p('Evgeni','Malkin','C',71,38,86,6.1,'RUS'),
      p('Bryan','Rust','RW',17,32,83,5.1,'USA'), p('Rickard','Rakell','RW',67,31,82,5.0,'SWE'),
      p('Jake','Guentzel','LW',59,30,88,6.0,'USA'), p('Drew','OConnor','LW',10,25,75,0.8,'USA'),
      p('Teddy','Blueger','C',53,29,75,2.2,'LVA'), p('Jeff','Carter','C',77,39,73,3.1,'CAN'),
      p('Reilly','Smith','RW',18,33,79,5.0,'CAN'), p('Jansen','Harkins','C',43,27,74,0.8,'CAN'),
      p('Lars','Eller','C',20,35,75,2.0,'DNK'), p('Noel','Acciari','C',55,32,72,1.3,'CAN'),
      p('Kevin','Hayes','C',13,32,76,3.6,'USA'),
      p('Kris','Letang','D',58,37,86,6.1,'CAN'), p('Marcus','Pettersson','D',28,28,79,4.0,'SWE'),
      p('Erik','Karlsson','D',65,34,86,11.5,'SWE'), p('Ryan','Graves','D',27,29,78,4.5,'CAN'),
      p('Chad','Ruhwedel','D',2,34,71,0.8,'USA'), p('Pierre-Olivier','Joseph','D',73,25,75,0.9,'CAN'),
      p('Mark','Friedman','D',52,28,72,0.8,'CAN'),
      p('Tristan','Jarry','G',35,29,83,5.4,'CAN'), p('Alex','Nedeljkovic','G',39,28,79,1.5,'CAN'),
    ]
  },
  {
    abbrev: 'SJS', name: 'San Jose Sharks', conference: 'Western', division: 'Pacific', color: '#006D75',
    players: [
      p('Tomas','Hertl','C',48,30,84,8.1,'CZE'), p('Logan','Couture','C',39,35,80,8.0,'CAN'),
      p('William','Eklund','LW',72,21,79,0.9,'SWE'), p('Fabian','Zetterlund','RW',20,24,78,0.9,'SWE'),
      p('Mikael','Granlund','C',64,31,80,5.0,'FIN'), p('Alexander','Barabanov','LW',94,29,78,2.5,'RUS'),
      p('Luke','Kunin','C',11,26,76,2.8,'USA'), p('Nico','Sturm','C',7,28,73,2.0,'DEU'),
      p('Steven','Lorentz','C',16,28,72,0.8,'CAN'), p('Kevin','Labanc','RW',62,28,74,1.0,'CAN'),
      p('Noah','Gregor','LW',73,25,72,0.8,'CAN'), p('Anthony','Duclair','LW',10,28,78,3.0,'CAN'),
      p('Ty','Dellandrea','C',42,23,74,1.0,'CAN'),
      p('Erik','Karlsson','D',65,34,88,11.5,'SWE'), p('Mario','Ferraro','D',38,25,80,3.3,'CAN'),
      p('Matt','Benning','D',5,29,74,1.3,'CAN'), p('Jan','Rutta','D',18,33,74,2.8,'CZE'),
      p('Henry','Thrun','D',3,23,74,0.9,'USA'), p('Kyle','Burroughs','D',4,28,73,0.8,'CAN'),
      p('Nikolai','Knyzhov','D',71,26,73,0.8,'RUS'),
      p('Mackenzie','Blackwood','G',29,27,82,2.4,'CAN'), p('Kaapo','Kahkonen','G',36,28,76,2.0,'FIN'),
    ]
  },
  {
    abbrev: 'SEA', name: 'Seattle Kraken', conference: 'Western', division: 'Pacific', color: '#001628',
    players: [
      p('Matty','Beniers','C',10,21,83,0.9,'USA'), p('Jared','McCann','C',19,28,85,5.0,'CAN'),
      p('Jordan','Eberle','RW',7,33,80,5.5,'CAN'), p('Oliver','Bjorkstrand','RW',22,29,80,5.4,'DNK'),
      p('Andre','Burakovsky','LW',95,29,81,5.5,'AUT'), p('Yanni','Gourde','C',37,32,79,5.2,'CAN'),
      p('Jaden','Schwartz','LW',17,32,78,5.5,'CAN'), p('Brandon','Tanev','LW',13,32,76,3.5,'CAN'),
      p('Eeli','Tolvanen','RW',20,25,76,1.5,'FIN'), p('Daniel','Sprong','RW',91,27,76,0.8,'NLD'),
      p('Tye','Kartye','RW',50,24,73,0.8,'CAN'), p('Ryan','Winterton','C',73,22,73,0.8,'CAN'),
      p('Shane','Wright','C',51,20,78,0.9,'CAN'),
      p('Vince','Dunn','D',29,27,84,4.0,'CAN'), p('Adam','Larsson','D',6,31,80,4.0,'SWE'),
      p('Jamie','Oleksiak','D',24,31,77,4.6,'CAN'), p('Carson','Soucy','D',44,29,78,2.8,'CAN'),
      p('Will','Borgen','D',3,27,76,2.1,'USA'), p('Ryker','Evans','D',57,22,74,0.9,'CAN'),
      p('Josh','Mahura','D',5,26,73,0.8,'CAN'),
      p('Philipp','Grubauer','G',31,32,81,5.9,'DEU'), p('Joey','Daccord','G',35,27,80,1.2,'USA'),
    ]
  },
  {
    abbrev: 'STL', name: 'St. Louis Blues', conference: 'Western', division: 'Central', color: '#002F87',
    players: [
      p('Robert','Thomas','C',18,25,88,8.1,'CAN'), p('Jordan','Kyrou','RW',25,26,86,6.5,'CAN'),
      p('Pavel','Buchnevich','RW',89,29,87,5.8,'RUS'), p('Brandon','Saad','LW',20,31,78,4.5,'USA'),
      p('Brayden','Schenn','C',10,33,82,6.5,'CAN'), p('Jake','Neighbours','LW',63,22,79,0.9,'CAN'),
      p('Sammy','Blais','LW',79,28,73,1.5,'CAN'), p('Oskar','Sundqvist','C',70,30,74,2.8,'SWE'),
      p('Alexey','Toropchenko','RW',13,24,73,0.8,'RUS'), p('Nathan','Walker','LW',26,29,72,0.8,'AUS'),
      p('Kasperi','Kapanen','RW',42,27,76,3.2,'FIN'), p('Jakub','Vrana','LW',15,28,76,3.5,'CZE'),
      p('Dylan','McLaughlin','C',27,28,71,0.8,'USA'),
      p('Colton','Parayko','D',55,31,83,6.5,'CAN'), p('Torey','Krug','D',47,33,82,6.5,'USA'),
      p('Justin','Faulk','D',72,32,82,6.5,'USA'), p('Nick','Leddy','D',4,33,77,4.0,'USA'),
      p('Robert','Bortuzzo','D',41,34,72,1.4,'USA'), p('Marco','Scandella','D',6,34,74,3.3,'CAN'),
      p('Scott','Perunovich','D',48,26,76,0.8,'USA'),
      p('Jordan','Binnington','G',50,31,84,6.0,'CAN'), p('Joel','Hofer','G',30,24,78,0.8,'CAN'),
    ]
  },
  {
    abbrev: 'TBL', name: 'Tampa Bay Lightning', conference: 'Eastern', division: 'Atlantic', color: '#002868',
    players: [
      p('Nikita','Kucherov','RW',86,31,95,9.5,'RUS'), p('Brayden','Point','C',21,28,91,9.5,'CAN'),
      p('Steven','Stamkos','C',91,34,87,8.5,'CAN'), p('Brandon','Hagel','LW',38,25,83,1.5,'CAN'),
      p('Anthony','Cirelli','C',71,26,83,6.3,'CAN'), p('Nick','Paul','LW',20,29,79,3.2,'CAN'),
      p('Tanner','Jeannot','LW',84,27,75,2.7,'CAN'), p('Conor','Sheary','LW',73,32,75,1.5,'CAN'),
      p('Ross','Colton','C',79,27,78,1.0,'USA'), p('Mikey','Eyssimont','LW',23,27,73,0.8,'USA'),
      p('Luke','Glendening','C',11,35,71,0.8,'USA'), p('Austin','Watson','RW',16,32,71,0.8,'USA'),
      p('Michael','Eyssimont','C',23,27,73,0.8,'USA'),
      p('Victor','Hedman','D',77,33,91,7.9,'SWE'), p('Mikhail','Sergachev','D',98,26,85,8.5,'RUS'),
      p('Erik','Cernak','D',81,27,81,5.2,'SVK'), p('Nick','Perbix','D',48,25,76,0.9,'USA'),
      p('Darren','Raddysh','D',43,27,74,0.8,'CAN'), p('Calvin','de Haan','D',44,33,73,0.8,'CAN'),
      p('Haydn','Fleury','D',7,27,73,0.8,'CAN'),
      p('Andrei','Vasilevskiy','G',88,30,91,9.5,'RUS'), p('Jonas','Johansson','G',31,28,76,0.8,'SWE'),
    ]
  },
  {
    abbrev: 'TOR', name: 'Toronto Maple Leafs', conference: 'Eastern', division: 'Atlantic', color: '#00205B',
    players: [
      p('Auston','Matthews','C',34,27,96,13.3,'USA'), p('Mitch','Marner','RW',16,27,93,10.9,'CAN'),
      p('William','Nylander','RW',88,28,90,11.5,'SWE'), p('John','Tavares','C',91,33,85,11.0,'CAN'),
      p('Max','Domi','C',11,29,80,3.0,'CAN'), p('Tyler','Bertuzzi','LW',59,29,80,5.5,'CAN'),
      p('Calle','Jarnkrok','RW',19,33,78,2.1,'SWE'), p('David','Kampf','C',64,29,75,2.4,'CZE'),
      p('Bobby','McMann','LW',74,27,76,0.8,'CAN'), p('Pontus','Holmberg','C',29,24,74,0.8,'SWE'),
      p('Ryan','Reaves','RW',75,37,68,1.4,'CAN'), p('Noah','Gregor','LW',18,26,72,0.8,'CAN'),
      p('Matthew','Knies','LW',23,21,79,0.9,'USA'),
      p('Morgan','Rielly','D',44,30,86,7.5,'CAN'), p('Jake','McCabe','D',22,30,81,4.0,'USA'),
      p('TJ','Brodie','D',78,34,79,5.0,'CAN'), p('Timothy','Liljegren','D',37,25,78,3.0,'SWE'),
      p('Mark','Giordano','D',55,40,74,0.8,'CAN'), p('John','Klingberg','D',3,31,77,4.2,'SWE'),
      p('Simon','Benoit','D',86,25,73,0.8,'CAN'),
      p('Joseph','Woll','G',60,25,83,0.8,'USA'), p('Ilya','Samsonov','G',35,27,80,3.6,'RUS'),
    ]
  },
  {
    abbrev: 'UTA', name: 'Utah Hockey Club', conference: 'Western', division: 'Central', color: '#69B3E7',
    players: [
      p('Clayton','Keller','RW',9,25,87,7.2,'USA'), p('Nick','Schmaltz','C',8,28,84,5.9,'USA'),
      p('Barrett','Hayton','C',29,23,78,2.7,'CAN'), p('Lawson','Crouse','LW',67,27,80,4.3,'CAN'),
      p('Dylan','Guenther','RW',11,21,83,0.9,'CAN'), p('Josh','Doan','RW',91,23,76,0.9,'USA'),
      p('Logan','Cooley','C',92,20,82,0.9,'USA'), p('Matias','Maccelli','LW',63,24,79,0.9,'FIN'),
      p('Jason','Zucker','LW',16,32,77,5.3,'USA'), p('Alex','Kerfoot','C',15,30,76,3.5,'CAN'),
      p('Michael','Carcone','LW',53,27,73,0.8,'CAN'), p('Travis','Boyd','C',72,30,73,0.8,'USA'),
      p('Liam','OBrien','LW',38,29,69,1.0,'CAN'),
      p('Sean','Durzi','D',50,25,80,3.5,'CAN'), p('Juuso','Valimaki','D',6,25,74,1.6,'FIN'),
      p('J.J.','Moser','D',90,24,79,3.8,'CHE'), p('Ian','Cole','D',28,35,73,1.0,'USA'),
      p('Michael','Kesselring','D',5,24,74,0.9,'USA'), p('Maveric','Lamoureux','D',41,20,72,0.9,'CAN'),
      p('Josh','Brown','D',3,30,71,1.0,'CAN'),
      p('Connor','Ingram','G',39,27,80,2.0,'CAN'), p('Karel','Vejmelka','G',70,28,78,2.7,'CZE'),
    ]
  },
  {
    abbrev: 'VAN', name: 'Vancouver Canucks', conference: 'Western', division: 'Pacific', color: '#00205B',
    players: [
      p('Elias','Pettersson','C',40,25,92,11.6,'SWE'), p('J.T.','Miller','C',9,31,88,8.0,'USA'),
      p('Brock','Boeser','RW',6,27,84,6.7,'USA'), p('Conor','Garland','RW',8,28,82,4.9,'USA'),
      p('Nils','Hoglander','LW',21,23,78,2.0,'SWE'), p('Andrei','Kuzmenko','LW',96,28,83,5.5,'RUS'),
      p('Ilya','Mikheyev','LW',65,29,78,4.8,'RUS'), p('Pius','Suter','C',24,28,78,3.0,'CHE'),
      p('Sam','Lafferty','C',15,29,74,1.1,'USA'), p('Teddy','Blueger','C',53,29,75,1.5,'LVA'),
      p('Dakota','Joshua','LW',37,28,74,1.2,'USA'), p('Phil','Di Giuseppe','LW',34,30,72,0.8,'CAN'),
      p('Vasily','Podkolzin','RW',92,23,75,0.9,'RUS'),
      p('Quinn','Hughes','D',43,25,93,7.9,'USA'), p('Filip','Hronek','D',17,26,84,7.3,'CZE'),
      p('Tyler','Myers','D',57,34,77,6.0,'USA'), p('Carson','Soucy','D',44,29,78,3.5,'CAN'),
      p('Noah','Juulsen','D',3,27,73,0.8,'CAN'), p('Guillaume','Brisebois','D',55,26,71,0.8,'CAN'),
      p('Ethan','Bear','D',74,27,75,0.8,'CAN'),
      p('Thatcher','Demko','G',35,28,88,5.0,'USA'), p('Arturs','Silovs','G',31,23,76,0.8,'LVA'),
    ]
  },
  {
    abbrev: 'VGK', name: 'Vegas Golden Knights', conference: 'Western', division: 'Pacific', color: '#B4975A',
    players: [
      p('Jack','Eichel','C',9,27,91,10.0,'USA'), p('Mark','Stone','RW',61,32,89,9.5,'CAN'),
      p('William','Karlsson','C',71,31,82,5.9,'SWE'), p('Chandler','Stephenson','C',20,30,80,3.0,'CAN'),
      p('Reilly','Smith','RW',19,33,80,5.0,'CAN'), p('Ivan','Barbashev','LW',49,28,82,5.0,'RUS'),
      p('Pavel','Dorofeyev','LW',16,24,78,0.9,'RUS'), p('Michael','Amadio','C',22,28,75,0.9,'CAN'),
      p('Nicolas','Roy','C',10,27,77,3.0,'CAN'), p('Keegan','Kolesar','RW',55,27,74,1.8,'CAN'),
      p('William','Carrier','LW',28,29,74,2.8,'CAN'), p('Brett','Howden','C',21,26,74,2.1,'CAN'),
      p('Jonas','Rondbjerg','RW',46,24,72,0.8,'DNK'),
      p('Alex','Pietrangelo','D',7,34,87,8.8,'CAN'), p('Shea','Theodore','D',27,29,86,5.2,'CAN'),
      p('Noah','Hanifin','D',15,27,84,5.0,'USA'), p('Brayden','McNabb','D',3,33,79,2.9,'CAN'),
      p('Nicolas','Hague','D',14,25,78,2.3,'CAN'), p('Zach','Whitecloud','D',2,27,77,2.8,'CAN'),
      p('Ben','Hutton','D',88,31,72,0.8,'CAN'),
      p('Adin','Hill','G',33,28,84,4.8,'CAN'), p('Logan','Thompson','G',36,27,82,0.8,'CAN'),
    ]
  },
  {
    abbrev: 'WSH', name: 'Washington Capitals', conference: 'Eastern', division: 'Metropolitan', color: '#041E42',
    players: [
      p('Alex','Ovechkin','LW',8,39,89,9.5,'RUS'), p('Dylan','Strome','C',17,27,85,5.0,'CAN'),
      p('Tom','Wilson','RW',43,30,82,5.2,'CAN'), p('Sonny','Milano','LW',15,28,77,0.8,'USA'),
      p('Evgeny','Kuznetsov','C',92,32,82,7.8,'RUS'), p('Nic','Dowd','C',26,34,74,1.4,'USA'),
      p('Lars','Eller','C',20,35,76,3.5,'DNK'), p('Connor','McMichael','C',24,23,78,0.8,'CAN'),
      p('Aliaksei','Protas','C',21,23,77,0.9,'BLR'), p('T.J.','Oshie','RW',77,37,78,5.8,'USA'),
      p('Hendrix','Lapierre','C',29,22,76,0.9,'CAN'), p('Nicolas','Aube-Kubel','RW',96,28,72,1.1,'CAN'),
      p('Andrew','Mangiapane','LW',88,28,78,5.8,'CAN'),
      p('John','Carlson','D',74,34,84,8.0,'USA'), p('Dmitry','Orlov','D',9,32,82,6.1,'RUS'),
      p('Nick','Jensen','D',3,33,79,2.5,'USA'), p('Erik','Gustafsson','D',56,32,76,0.8,'SWE'),
      p('Martin','Fehervary','D',42,25,78,2.5,'SVK'), p('Trevor','van Riemsdyk','D',57,32,73,1.0,'USA'),
      p('Alexander','Alexeyev','D',27,23,74,0.9,'RUS'),
      p('Charlie','Lindgren','G',79,30,82,3.0,'USA'), p('Darcy','Kuemper','G',35,34,81,5.3,'CAN'),
    ]
  },
  {
    abbrev: 'WPG', name: 'Winnipeg Jets', conference: 'Western', division: 'Central', color: '#041E42',
    players: [
      p('Kyle','Connor','LW',81,27,90,7.1,'USA'), p('Mark','Scheifele','C',55,31,89,6.1,'CAN'),
      p('Nikolaj','Ehlers','LW',27,28,86,6.0,'DNK'), p('Cole','Perfetti','LW',91,22,80,0.9,'CAN'),
      p('Adam','Lowry','C',17,31,79,3.3,'CAN'), p('Pierre-Luc','Dubois','C',80,26,82,8.5,'CAN'),
      p('Vladislav','Namestnikov','LW',7,31,77,2.5,'RUS'), p('Mason','Appleton','RW',22,28,76,2.0,'USA'),
      p('Morgan','Barron','C',36,25,75,0.9,'CAN'), p('David','Gustafsson','C',19,24,74,0.9,'SWE'),
      p('Nino','Niederreiter','RW',21,31,78,4.0,'CHE'), p('Kevin','Stenlund','C',44,27,73,0.8,'SWE'),
      p('Karson','Kuhlman','RW',20,28,71,0.8,'USA'),
      p('Josh','Morrissey','D',44,29,89,6.3,'CAN'), p('Neal','Pionk','D',4,28,80,5.8,'USA'),
      p('Dylan','DeMelo','D',2,31,79,3.1,'CAN'), p('Brenden','Dillon','D',5,33,77,3.9,'CAN'),
      p('Nate','Schmidt','D',88,32,78,5.9,'USA'), p('Dylan','Samberg','D',54,25,77,0.9,'USA'),
      p('Logan','Stanley','D',64,25,74,1.4,'CAN'),
      p('Connor','Hellebuyck','G',37,31,93,8.5,'USA'), p('Laurent','Brossoit','G',30,31,80,1.8,'CAN'),
    ]
  },
];
