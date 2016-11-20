<?php

    class DataBase {

        private $link_id;
        private $time;

        private $hostname;
        private $username;
        private $password;
        private $database;
        private $charset;
        private $pconnect;

        private $is_log;

        //构造函数
        public function __construct() {

            require_once(dirname(__FILE__) . "/../../configure/config.db.php");

            $this->hostname = $config_db["hostname"];
            $this->username = $config_db["username"];
            $this->password = $config_db["password"];
            $this->database = $config_db["database"];
            $this->charset  = $config_db["charset"];
            $this->pconnect = $config_db["pconnect"];

            // 是否启用文件日志
            $this->is_log = $config_db["is_log"];

            $this->time = $this->microtime_float();
            $this->connect($this->hostname, $this->username, $this->password, $this->database, $this->pconnect, $this->charset);
        }

        //数据库连接
        public function connect($dbhost, $dbuser, $dbpw, $dbname, $pconnect = 0, $charset='utf8') {

            if ($pconnect === 0) {
                $this->link_id = @mysql_connect($dbhost, $dbuser, $dbpw, true);
                if (!$this->link_id) {
                    $this->halt("数据库连接失败");
                    Logs::debug("失败", "数据库连接");
                }
            } else {
                $this->link_id = @mysql_pconnect($dbhost, $dbuser, $dbpw);
                if (!$this->link_id) {
                    $this->halt("数据库持久连接失败");
                    Logs::debug("失败", "数据库持久连接");
                }
            }
            if (!@mysql_select_db($dbname, $this->link_id)) {
                $this->halt('数据库选择失败');
                Logs::debug("失败", "数据库连接");
            }
            @mysql_query("SET NAMES " . $charset);
        }

        //查询
        public function query($sql) {
            $this->write_log("查询:" . $sql);
//            Logs::debug($sql, "查询");
            $query = @mysql_query($sql, $this->link_id);
            if (!$query) {
                $this->halt("查询错误:" . $sql);
//                Logs::debug($sql, "查询错误");
            }
            return $query;
        }

        //获取一条记录（MYSQL_ASSOC，MYSQL_NUM，MYSQL_BOTH）
        public function get_one($table, $dataArray, $condition = "", $result_type = MYSQL_ASSOC) {
            if (empty($dataArray) || !is_array($dataArray) || count($dataArray) <= 0) {
                $field = "*";
            } else {
                $field = "";
                while (list($key, $val) = each($dataArray)) {
                    $field .= "`" . $val . "`,";
                }
                $field = substr($field, 0, -1);
            }
            $sql = "SELECT $field FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");
            $query = $this->query($sql);
            $rt =& mysql_fetch_array($query, $result_type);
            $this->write_log("获取一条记录:" . $sql);
            Logs::debug($sql, "获取一条记录");
            return $rt;
        }

        //获取全部记录
        public function get_all($table, $dataArray, $condition = "", $result_type = MYSQL_ASSOC) {
            if (empty($dataArray) || !is_array($dataArray) || count($dataArray) <= 0) {
                $field = "*";
            } else {
                $field = "";
                while (list($key, $val) = each($dataArray)) {
                    $field .= "`" . $val . "`,";
                }
                $field = substr($field, 0, -1);
            }
            $sql = "SELECT $field FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");
            $query = $this->query($sql);
            $i = 0;
            $rt = array();
            while ($row =& mysql_fetch_array($query, $result_type)) {
                $rt[$i] = $row;
                $i++;
            }
            $this->write_log("获取全部记录:" . $sql);
            Logs::debug($sql, "获取全部记录");
            return $rt;
        }

        //插入
        public function insert($table, $dataArray) {
            $field = "";
            $value = "";
            if (!is_array($dataArray) || count($dataArray) <= 0) {
                $this->halt('没有要插入的数据');
                Logs::debug("没有要插入的数据", "插入数据");
                return false;
            }
            while (list($key, $val) = each($dataArray)) {
                $field .= "`" . $key . "`,";
                $value .= "'" . $val . "',";
            }
            $field = substr($field, 0, -1);
            $value = substr($value, 0, -1);
            $sql = "INSERT INTO $table ($field) VALUES ($value)";
            $this->write_log("插入:" . $sql);
            Logs::debug($sql, "插入数据");
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        //更新
        public function update($table, $dataArray, $condition = "") {
            if (!is_array($dataArray) || count($dataArray) <= 0) {
                $this->halt('没有要更新的数据');
                Logs::debug("没有要更新的数据", "更新数据");
                return false;
            }
            $value = "";
            while (list($key, $val) = each($dataArray)) {
                $value .= "`" . $key . "` = '" . $val . "',";
            }
            $value .= substr($value, 0, -1);
            $sql = "UPDATE $table SET $value WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");
            $this->write_log("更新数据:".$sql);
            Logs::debug($sql, "更新数据");
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        //删除
        public function delete($table, $condition = "") {
            if(empty($condition)) {
                $this->halt("没有设置删除的条件");
                Logs::debug("没有设置删除的条件", "删除数据");
                return false;
            }
            $sql = "DELETE FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");
            $this->write_log("删除数据:" . $sql);
            Logs::debug($sql, "删除数据");
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        //返回结果集
        public function fetch_array($query, $result_type = MYSQL_ASSOC) {
            $this->write_log("返回结果集");
            Logs::debug("返回结果集", "数据库");
            return @mysql_fetch_array($query, $result_type);
        }

        //获取记录条数
        public function num_rows($results) {
            if(!is_bool($results)) {
                $num = @mysql_num_rows($results);
                $this->write_log("获取的记录条数为:" . $num);
                Logs::debug($num, "获取的记录条数为");
                return $num;
            } else {
                return 0;
            }
        }

        //获取最后插入的id
        public function insert_id() {
            $id = @mysql_insert_id($this->link_id);
            $this->write_log("最后插入的id为:" . $id);
            Logs::debug($id, "最后插入的id为");
            return $id;
        }

        //释放结果集
        public function free_result() {
            $void = func_get_args();
            foreach($void as $query) {
                if(is_resource($query) && strtolower(get_resource_type($query)) === 'mysql result') {
                    return @mysql_free_result($query);
                }
            }
            $this->write_log("释放结果集");
//            Logs::debug("释放结果集", "释放");
        }

        //关闭数据库连接
        protected function close() {
            $this->write_log("已关闭数据库连接:" . $this->link_id);
            Logs::debug($this->link_id, "已关闭数据库连接");
            return @mysql_close($this->link_id);
        }

        //错误提示
        private function halt($msg = '') {
            $msg .= "\r\n" . mysql_error();
            $this->write_log($msg);
            die($msg);
        }

        //析构函数
        public function __destruct() {
            $this->free_result();
            $use_time = ($this->microtime_float()) - ($this->time);
            $this->write_log("完成整个查询任务,所用时间为" . $use_time);
//            Logs::debug($use_time, "完成整个查询任务,所用时间为");
            if ($this->is_log) {
                fclose($this->handle);
            }
        }

        //写入日志文件
        public function write_log($msg = '') {
            if($this->is_log){
                $text = date("Y-m-d H:i:s") . " " . $msg . "\r\n";
                fwrite($this->handle, $text);
            }
        }

        //获取毫秒数
        public function microtime_float() {
            list($usec, $sec) = explode(" ", microtime());
            return ((float)$usec + (float)$sec);
        }
    }

