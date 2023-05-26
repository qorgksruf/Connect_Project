drop database if exists connect;
create database connect;
use connect;

drop table if exists calendarEvent;
drop table if exists ChatMessages;
drop table if exists ChatParticipants;
drop table if exists ChatRooms;
drop table if exists Approval;
drop table if exists addressbook;
drop table if exists address_group;
drop table if exists boarrd;
drop table if exists member;
drop table if exists part;


-- 부서 테이블
create table part(
   part_no int auto_increment primary key,                    -- 부서 PK
   part_name varchar(20)                                      -- 부서명
);

-- 회원테이블
create table member(
   member_no int auto_increment primary key,                    -- 멤버 PK
    member_id varchar(20) not null unique,                      -- 멤버 ID
    member_pwd varchar(20) not null,                            -- 멤버 비밀번호
    member_name varchar(10) not null,                           -- 멤버 이름
    member_phone varchar(20) not null,                          -- 멤버 전화번호
    memmber_email varchar(30),                                  -- 멤버 이메일
    member_profile longtext,									-- 멤버 프로필이미지
    member_rank char(1) not null,                               -- 직급   / 1: 사원 / 2: 주임 / 3: 대리 / 4: 과장 / 5: 차장 / 6: 부장 / 7: 팀장  / 9: 사장
    part_no int,                                                -- 부서
    foreign key ( part_no ) references part ( part_no )         -- 부서 FK 
);


create table board( -- 게시판
    board_no         int auto_increment primary key,  	-- 게시물번호
    board_title      varchar(1000) not null, 			-- 게시물 제목
    board_content      longtext,  						-- 게시물 내용
    board_date      datetime default now(),				-- 등록일
    board_view      int default 0, 						-- 조회수
    member_no         int, 								-- 사원번호 fk
    part_no      int, 									-- 부서번호 fk
    foreign key(member_no) references member(member_no) on delete cascade,
    foreign key(part_no) references part(part_no) on delete cascade
);


-- 그룹테이블
create table address_group(
	group_no int auto_increment primary key,                    -- 그룹 PK
    group_name varchar(100) not null,                           -- 그룹 이름
    group_type char(1) not null,                                -- 그룹 타입 / 1: 전체공유 / 2: 부서공유 / 3: 지정공유 / 4: 개인
    reg_member_no int,                                          -- 그룹등록자 FK         
    foreign key ( reg_member_no ) references member ( member_no ) on delete cascade
);


-- 주소록테이블
create table addressbook(
	addr_no int auto_increment primary key,                     -- 주소록 pk
    addr_name varchar(20) not null,                             -- 주소록 등록 이름
    addr_email varchar(30),                                    	-- 주소록 등록 이메일
	addr_phone varchar(20),                                     -- 주소록 등록 전화번호
    group_no int,                                              	-- 그룹 FK
    reg_member_no int,                                          -- 등록자 FK
    foreign key ( reg_member_no ) references member ( member_no ) on delete cascade,
    foreign key ( group_no ) references address_group ( group_no ) on delete cascade
);

-- 결재테이블
create table Approval(
	Approval_no int auto_increment primary key,             -- 결재
	Approval_writer varchar(50),                            -- 신청자1
    Approval_title varchar(50),                            	-- 제목   
    Approval_content varchar(100),                         	-- 내용
    Approval_status varchar(50),                            -- 결재단계 1 2
    Approval_date varchar(50)                               -- 작성일
);


-- 채팅방테이블
create table ChatRooms (                                    
   id int primary key auto_increment,                       # 채팅방 고유번호
    name varchar(40),                                       # 채팅방 이름
    data datetime default now()                             # 채팅 생성 날짜
);


-- 채팅방 참여자 테이블
create table ChatParticipants(                              # 채팅방 참여자 테이블  
	id int Primary Key auto_increment,                      # 참여자 테이블 고유 식별자
	member_no_fk int ,                                      # 사용자 ID (fk)
	chat_room_id int,                                       # 채팅방 ID (fk) 
	foreign key (member_no_fk) references member(member_no),
	foreign key (chat_room_id) references ChatRooms(id)
);


-- 채팅 메시지 테이블 
create table ChatMessages (                                	# 채팅 메세지 테이블
	id int Primary Key auto_increment,                     	# 메세지 ID
	content longtext,                                       # 메시지 내용
	timestamp datetime default now(),                       # 메세지 보낸 시간
    member_no_fk int,                                       # 보낸사람의 ID (fk) 
    chat_room_id int,                                       # 채팅방 ID (fk) 
    msg_type varchar(5),                              		# 메시지타입 동영상 mv , 파일이면 file, 메시지msg , img
    file_path longtext,                                     # 파일 경로
	foreign key (member_no_fk) references member(member_no),
    foreign key (chat_room_id) references ChatRooms(id)
);


-- 일정 캘린더
create table calendarEvent(                                -- 일정 캘린더
	calendar_no         int auto_increment primary key,    -- 일정번호
    calendar_title      varchar(50) not null,              -- 일정 제목
    calendar_content    longtext,                          -- 일정 내용
    calendar_start      datetime default now(),            -- 일정 시작일
	calendar_end        datetime default now(),            -- 일정 시작일
    member_no          	int,                               -- 일정 등록자 (사원번호 fk)
	foreign key(member_no) references member(member_no) on delete cascade
);
