<?php

    class DataBase {

        private $linkId;
        private $startTime;

        private $hostname;
        private $username;
        private $password;
        private $database;
        private $port;
        private $charset;

        /**
         * 构造函数
         *
         * 初始化数据库连接
         */
        public function __construct() {

            // 引入数据库配置
            require_once(dirname(__FILE__) . "/../../configure/config.db.php");

            // 设置配置信息
            $this->hostname = $config_db["hostname"];
            $this->username = $config_db["username"];
            $this->password = $config_db["password"];
            $this->database = $config_db["database"];
            $this->port     = $config_db["port"];
            $this->charset  = $config_db["charset"];

            // 查询计时开始
            $this->startTime = $this->microTimeFloat();

            // 连接数据库
            $this->connect($this->hostname, $this->username, $this->password, $this->database, $this->port, $this->charset);
        }

        /**
         * 连接数据库
         *
         * @param string $hostname
         * @param string $username
         * @param string $password
         * @param string $database
         * @param int $port
         * @param string $charset
         */
        public function connect($hostname, $username, $password, $database, $port, $charset='UTF8') {

            // 连接数据库
            $this->linkId = @mysqli_connect($hostname, $username, $password, $database, $port);

            if (mysqli_connect_errno()) {
                $this->halt("连接数据库错误:" . mysqli_connect_error());
            }

            @mysqli_query($this->linkId, "SET NAMES " . $charset);
        }

        /**
         * 查询
         *
         * @param string $sql
         * @return bool|mysqli_result
         */
        public function query($sql) {

            Logs::debug($sql, "查询");

            // 执行
            $query = @mysqli_query($this->linkId, $sql);

            if (!$query) {
                $this->halt("查询错误:" . $sql);
                Logs::debug($sql, "查询错误");
            }

            // 返回数据库结果集
            return $query;
        }

        /**
         * 获取一条记录（MYSQLI_ASSOC，MYSQLI_NUM，MYSQLI_BOTH）
         *
         * @param string $table
         * @param array $dataArray
         * @param string $condition
         * @return array|null
         */
        public function getRow($table, $dataArray, $condition = "", $limit = "") {

            // 构造查询字段
            if (empty($dataArray) || !is_array($dataArray) || count($dataArray) <= 0) {
                $field = "*";
            } else {
                $field = "";
                while (list($key, $val) = each($dataArray)) {
                    $field .= "`" . $val . "`,";
                }
                $field = substr($field, 0, -1);
            }

            // 执行
            $sql = "SELECT $field FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "") . (!empty($limit) ? " LIMIT $limit, 1" : "");
            $query = $this->query($sql);
            $rt =& mysqli_fetch_row($query);

            Logs::debug($sql, "获取一条记录");

            return $rt;
        }

        /**
         * 获取记录数组
         *
         * @param string $table
         * @param array $dataArray
         * @param string $condition
         * @param int $resultType
         * @return array
         */
        public function get($table, $dataArray, $condition = "", $limit = "", $resultType = MYSQLI_ASSOC) {

            // 构造查询字段
            if (empty($dataArray) || !is_array($dataArray) || count($dataArray) <= 0) {
                $field = "*";
            } else {
                $field = "";
                while (list($key, $val) = each($dataArray)) {
                    $field .= "`" . $val . "`,";
                }
                $field = substr($field, 0, -1);
            }

            // 执行
            $sql = "SELECT $field FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "") . (!empty($limit) ? " LIMIT $limit" : "");
            $query = $this->query($sql);

            // 获取查询结果
            $rt = array();

            while ($row =& mysqli_fetch_array($query, $resultType)) {
                $rt[] = $row;
            }

            Logs::debug($sql, "获取记录数组");

            return $rt;
        }

        /**
         * 插入记录
         *
         * @param string $table
         * @param array $dataArray
         * @return bool
         */
        public function insert($table, $dataArray) {

            // 判断插入数据
            if (!is_array($dataArray) || count($dataArray) <= 0) {
                $this->halt('没有要插入的数据');
                Logs::debug("没有要插入的数据", "插入数据");
                return false;
            }

            // 构造插入字段
            $field = "";
            $value = "";

            while (list($key, $val) = each($dataArray)) {
                $field .= "`" . $key . "`,";
                $value .= "'" . $val . "',";
            }

            $field = substr($field, 0, -1);
            $value = substr($value, 0, -1);

            // 执行
            $sql = "INSERT INTO $table ($field) VALUES ($value)";

            Logs::debug($sql, "插入数据");

            // 判断插入结果
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        /**
         * 更新数据
         *
         * @param string $table
         * @param array $dataArray
         * @param string $condition
         * @return bool
         */
        public function update($table, $dataArray, $condition = "") {

            // 判断更新数据
            if (!is_array($dataArray) || count($dataArray) <= 0) {
                $this->halt('没有要更新的数据');
                Logs::debug("没有要更新的数据", "更新数据");
                return false;
            }

            // 构造更新字段
            $value = "";

            while (list($key, $val) = each($dataArray)) {
                $value .= "`" . $key . "` = '" . $val . "',";
            }

            $value = substr($value, 0, -1);

            // 执行
            $sql = "UPDATE $table SET $value WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");

            Logs::debug($sql, "更新数据");

            // 判断更新结果
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        /**
         * 删除记录
         *
         * @param string $table
         * @param string $condition
         * @return bool
         */
        public function delete($table, $condition = "") {

            // 判断删除条件不能为空
            if(empty($condition)) {
                $this->halt("没有设置删除的条件");
                Logs::debug("没有设置删除的条件", "删除数据");
                return false;
            }

            // 执行
            $sql = "DELETE FROM $table WHERE 1=1" . (!empty($condition) ? " AND ($condition)" : "");

            Logs::debug($sql, "删除数据");

            // 判断删除结果
            if (!$this->query($sql)) {
                return false;
            } else {
                return true;
            }
        }

        /**
         * 返回结果集
         *
         * @param string $query
         * @param int $resultType
         * @return array|null
         */
        public function fetchArray($query, $resultType = MYSQLI_ASSOC) {

            Logs::debug("返回结果集", "数据库");

            return @mysqli_fetch_array($query, $resultType);
        }

        /**
         * 获取记录条数
         *
         * @param $results
         * @return int
         */
        public function numRows($results) {

            // 如果有结果
            if(!is_bool($results)) {
                $num = @mysqli_num_rows($results);

                Logs::debug($num, "获取的记录条数为");

                return $num;
            } else {
                return 0;
            }
        }

        /**
         * 获取最后插入的id
         *
         * @return int|string
         */
        public function insertId() {
            $id = @mysqli_insert_id($this->linkId);

            Logs::debug($id, "最后插入的id为");

            return $id;
        }

        /**
         * 释放结果集
         */
        protected function freeResult() {
            $void = func_get_args();

            foreach($void as $query) {
                if(is_resource($query) && strtolower(get_resource_type($query)) === 'mysql result') {
                    Logs::debug("释放结果集", "释放");
                    return @mysqli_free_result($query);
                }
            }
        }

        /**
         * 关闭数据库连接
         *
         * @return bool
         */
        protected function close() {

            if (@mysqli_close($this->linkId)) {
                Logs::debug($this->linkId, "数据库连接已关闭");
            } else {
                Logs::debug($this->linkId, "关闭数据库连接失败");
            }
        }

        /**
         * 错误提示
         *
         * @param string $msg
         */
        protected function halt($msg = '') {
            $msg .= "\r\n" . mysqli_error();
            die($msg);
        }

        /**
         * 析构函数
         *
         * 释放结果集，关闭数据库连接
         */
        public function __destruct() {

            // 释放结果集
            $this->freeResult();

            // 关闭数据库连接
            $this->close();

            $duration = ($this->microTimeFloat()) - ($this->startTime);

            Logs::debug($duration, "完成整个查询任务,所用时长为");
        }

        /**
         * 获取毫秒数
         *
         * @return float
         */
        protected function microTimeFloat() {
            list($usec, $sec) = explode(" ", microtime());
            return ((float)$usec + (float)$sec);
        }
    }

