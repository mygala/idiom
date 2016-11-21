<?php
/**
 * Created by PhpStorm.
 * User: HONOR
 * Date: 16/11/21
 * Time: 01:55
 */

    require_once(dirname(__FILE__) . "/../utils/runtime.php");
    require_once(dirname(__FILE__) . "/../modules/get/get.class.php");

    Logs::debug("Test FirePHP", "Test");

    $db = new DataBase();

    $dataArray = array(
        "cheng_yu", "s_pinyin"
    );

    $rt = $db->get("`cheng_yu`", $dataArray, "`s_pinyin` LIKE 'ab%'");

    echo json_encode($rt);