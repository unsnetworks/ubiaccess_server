/*
 * 사용자 데이터 처리
 *
 */

var user = {};

var sql = {
    create:'insert into users set ?',
    read:'select \
            id, first_name, middle_name, last_name, gender, birth, emp_type, \
            emp_charge, emp_level, create_date, modify_date \
          from users \
          where ?',
    search:'select \
                id, first_name, middle_name, last_name, gender, birth, \
                emp_type, emp_charge, emp_level, create_date, modify_date \
            from users',
    search2:'select \
                id, first_name, middle_name, last_name, gender, birth, \
                emp_type, emp_charge, emp_level, create_date, modify_date \
            from users \
            where ?',
    update:'update users \
            set ? \
            where ?',
    delete:'delete from users where ?'
}

// 사용자 추가
user.create = function(pool, data, callback) {
	console.log('user.create 호출됨.');
    console.dir(data);
	
	pool.execute(pool, sql.create, data, callback);
};

// 사용자 조회
user.read = function(pool, data, callback) {
	console.log('user.read 호출됨.');
    console.dir(data);
	
	pool.execute(pool, sql.read, data, callback);
};

// 사용자 검색
user.search = function(pool, data, callback) {
	console.log('user.search 호출됨.');
    console.dir(data);
	
    
    if (data) {
        pool.execute(pool, sql.search2, data, callback);
    } else {
        pool.execute(pool, sql.search, data, callback);
    }
    
};

// 사용자 업데이트
user.update = function(pool, data, callback) {
	console.log('user.update 호출됨.');
    console.dir(data);
	
	pool.execute(pool, sql.update, data, callback);
};

// 사용자 삭제
user.delete = function(pool, data, callback) {
	console.log('user.delete 호출됨.');
    console.dir(data);
	
	pool.execute(pool, sql.delete, data, callback);
};


module.exports = user;
