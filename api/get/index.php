<?php
/**
 * Created by PhpStorm.
 * User: HONOR
 * Date: 16/11/21
 * Time: 01:55
 */

    require_once(dirname(__FILE__) . "/../../core/class/get/get.class.php");

    $dbLink = new DataBase();

    $query = "SELECT * FROM `cheng_yu` WHERE `cheng_yu` = '一丁不识'";

    $aaa = $dbLink->query($query);

    var_dump($aaa->abcd);