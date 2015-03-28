var conn=new Mongo();
var db= conn.getDB('allcast');

var result =db.broadcasters
              .update({
               broadCastName:'kwame',
               userName:'demo',
               'activity.disconnected':{'$exists':false},
               'activity.connected':{'$sorts':-1}},
               {'$set':{'activity.0.disconnected':Date.now()}}
               );



// var cursor=db.broadcasters.find({
//                     userName:'demo',
//                     broadCastName:'dd',
//                     $orderby:{'activity.connected':-1}
//                 }
// );
// while ( cursor.hasNext() ) {
//    printjson( cursor.next() );
// }

print('shake it off');
print(result);
// print(result);

