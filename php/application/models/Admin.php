<?php
require_once APPLICATION_ROOT_PATH . 'models/Base.php';

class Admin extends Base{
    //管理员登陆后台
    public function login($name, $password) {
        $name = trim($name);
        if ($this->checkAdminUser($name, $this->_encrypt(trim($password)))) {
            $result = $this->select('fetchRow','adminuser',array('where'=>array('name=?',$name)));
            $_SESSION['ADMIN_ID'] = $result['id'];
            $_SESSION['ADMIN_NAME'] = $result['name'];
            $_SESSION['ADMIN_PASSWORD'] = $result['password'];
            $_SESSION['ADMIN_NICKNAME'] = $result['nickname'];
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断管理员是否登陆
     * @return bool false 未登陆，true 已登陆
     */
    public function checkLogin() {
        if (
            empty($_SESSION['ADMIN_ID']) ||
            empty($_SESSION['ADMIN_NAME']) ||
            empty($_SESSION['ADMIN_PASSWORD']) ||
            !$this->checkAdminUser($_SESSION['ADMIN_NAME'], $_SESSION['ADMIN_PASSWORD'])
        ) {
            return false;
        } else {
            return true;
        }
    }

    //登录验证
    public function checkAdminUser($name, $password) {
        $getpassword = $this->select('fetchOne','adminuser',array(
            'where'=>array('name=?',$name),
            'col'=>'password'
        ));
        if (empty($getpassword) || $getpassword != $password){
            return false;
        }else{
            return true;
        }
    }

    //密码加密
    public function _encrypt($str) {
        return md5(md5($str));
    }
}
?>