<?php

class Base
{
    public function __construct(){
        $this->_db = Zend_Registry::get('db');
        $this->webUrl = ((int)$_SERVER['SERVER_PORT'] == 443 ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . '/';
    }
    
    /**
     * $params Array(where?,order?,limit?,col?)
     * where: Array(array('id=?','4'))
     */
    public function select($type,$table,$params = array()){
        $select = $this->_db->select();
        if (!isset($params['col'])){
            $params['col'] = '*';
        }else{
            $params['col'] = explode(",", $params['col']);
        }
        $select->from($table, $params['col']);
        if (isset($params["where"])){
            if(is_array($params['where'][0])){
                foreach ($params['where'] as $value) {
                    $select->where($value[0],$value[1]);
                }
            }else{
                $select->where($params['where'][0],$params['where'][1]);
            }
        }

        if (isset($params["order"])){
            if(is_array($params['order'])){
                foreach ($params['order'] as $value) {
                    $select->order($value);
                }
            }else{
                $select->order($params["order"]);
            }
        }

        if (isset($params["limit"])){
            $select->limit($params["limit"][0],$params["limit"][1]);
        }

        if (isset($params["group"])) {
            $select->group($params["group"]);
        }

        $result = $this->_db->$type($select);
        return $result;
    }

    /**
     * $row = array('favorite_color' => 'yellow');
     */
    public function insert($table,$row){
        $this->_db->insert($table, $row);
        return $this->_db->lastInsertId();
    }

    /**
    * $set = array('favorite_color' => 'yellow');
    * $where = array('first_name = ?','name')
    */
    public function update($table,$set,$where){
        $where = $this->_db->quoteInto($where[0], $where[1]);
        
        // 更新表数据,返回更新的行数
        return $this->_db->update($table, $set, $where);
    }

    /**
    * $where = array('first_name = ?','name')
    */
    public function delete($table,$where){
        $where = $this->_db->quoteInto($where[0], $where[1]);

        // 删除数据并得到影响的行数
        return $this->_db->delete($table, $where);
    }

    public function upfilesArr($files){
        $fileUrlArr = array();
        $l = count($files['name']);
        for ($i = 0; $i < $l; $i++) {
            $tmp = array(
                'name' => $files['name'][$i],
                'type' => $files['type'][$i],
                'size' => $files['size'][$i],
                'error' => $files['error'][$i],
                'tmp_name' => $files['tmp_name'][$i],
                'rules' => $files['rules']
            );
            $fileUrl = $this->upfile($tmp);
            array_push($fileUrlArr, $this->webUrl . $fileUrl);
        }
        return $fileUrlArr;
    }

    public function upfiles($files, $rulesSet){
        $urlArr = array();

        foreach ($files as $key => $file) {
            $file['rules'] = isset($rulesSet[$key]) ? json_decode($rulesSet[$key], true) : array();
            if (is_array($file['name'])) {
                $urlArr[$key] = $this->upfilesArr($file);
            } else {
                $fileUrl = $this->upfile($file);
                $urlArr[$key] = $this->webUrl . $fileUrl;
            }
        }
        return (count($urlArr) === 1) ? $urlArr[$key] : $urlArr;
    }

    public function upfile($file){
        $rules = array(
            'name' => isset($file['rules']['name']) ? $file['rules']['name'] : uniqid(),
            'size' => isset($file['rules']['size']) ? $file['rules']['size'] : 1024 * 1024 * 10,
            'path' => isset($file['rules']['path']) ? $file['rules']['path'] : 'upload',
            'mime' => isset($file['rules']['mime']) ? $file['rules']['mime'] : null
        );
        extract($rules);
        $path = dirname(dirname(dirname(__FILE__))) . '/htdocs/' . $path . '/';

        if (!file_exists($path)) {
            throw new Exception($name . '上传位置出错' . $path);
        }

        if (isset($file['error']) && $file['error'] !== 0) {
            throw new Exception($name . '文件异常，请检查' . $file['error']);
        }
        $ext = strrchr($file["name"], '.');

        $msg = '';

        if (!empty($mime) && !in_array($file['type'], $mime)) {
            $msg .= $name . '文件类型错误，请检查!';
        }

        if (!empty($size) && $file['size'] > $size) {
            $msg .= $name . '文件过大，请检查!';
        }

        if ($msg == '') {
            $pathinfo = $path . $name . $ext;
            if (!move_uploaded_file($file['tmp_name'], $pathinfo)) {
                $msg = $name . '上传失败，请重试';
            }
        }
        if ($msg != '') {
            throw new Exception($msg);
        } else {
            return $rules['path'] . '/' . $name . $ext;
        }
    }

    public function Post($url, $data){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_TIMEOUT, 20);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $return = curl_exec($ch);
        if (curl_errno($ch)) {
            Logs::Write('curl', 'curl_errno:' . curl_error($ch));
        }
        curl_close($ch);
        return $return;
    }

    function Get($url){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $output = curl_exec($ch);
        if (curl_errno($ch)) {
            Logs::Write('curl', 'curl_errno:' . curl_error($ch));
        }
        curl_close($ch);
        return $output;
    }
}
