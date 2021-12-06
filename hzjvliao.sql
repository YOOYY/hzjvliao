/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50723
 Source Host           : localhost:3306
 Source Schema         : hzjvliao

 Target Server Type    : MySQL
 Target Server Version : 50723
 File Encoding         : 65001

 Date: 06/12/2021 15:03:04
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for adminuser
-- ----------------------------
DROP TABLE IF EXISTS `adminuser`;
CREATE TABLE `adminuser`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of adminuser
-- ----------------------------
INSERT INTO `adminuser` VALUES (1, 'test', 'fb469d7ef430b0baf0cab6c436e70375', '管理员');

-- ----------------------------
-- Table structure for apply
-- ----------------------------
DROP TABLE IF EXISTS `apply`;
CREATE TABLE `apply`  (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `sex` int(1) NULL DEFAULT 2,
  `province` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `degree` int(1) NULL DEFAULT NULL,
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `photos` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `video` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `weight` int(255) NOT NULL DEFAULT 0,
  `time` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '毫秒',
  `state` int(1) UNSIGNED NOT NULL DEFAULT 2,
  `userid` int(11) NULL DEFAULT NULL,
  `poster` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 49 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of apply
-- ----------------------------
INSERT INTO `apply` VALUES (1, '艾琳', 0, 'beijing', 0, '88888888', 'http://shp.qpic.cn/ishow/2735020816/1612773198_84828260_24517_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020916/1612860663_84828260_26932_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735121114/1607666908_84828260_6772_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020816/1612773198_84828260_24517_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020916/1612860663_84828260_26932_sProdImgNo_2.jpg/0', 'http://test.com/upload/avatar1.png', 'http://test.com/upload/60dc327cb772d.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 0, '1619971200000', 1, 9, 'http://test.com/upload/60dc327cb772d.jpg');
INSERT INTO `apply` VALUES (2, '嫦娥', 0, 'beijing', 1, '88888888', 'http://shp.qpic.cn/ishow/2735040716/1617785833_84828260_32746_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735040920/1617970054_84828260_4697_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735040920/1617970549_84828260_22886_sProdImgNo_2.jpg/0', 'http://test.com/upload/avatar2.png', 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218093206z8V1JuPlpe.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 0, NULL, 2, NULL, NULL);
INSERT INTO `apply` VALUES (3, '司马懿', 1, 'beijing', 2, '88888888', 'http://shp.qpic.cn/ishow/2735041519/1618485629_84828260_22420_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735042018/1618915965_84828260_2160_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735011313/1610516936_84828260_3358_sProdImgNo_2.jpg/0', 'http://test.com/upload/avatar3.png', 'https://stream7.iqilu.com/10339/article/202002/18/2fca1c77730e54c7b500573c2437003f.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 0, NULL, 0, NULL, NULL);
INSERT INTO `apply` VALUES (4, '诸葛亮', 1, 'beijing', 0, '88888888', 'http://shp.qpic.cn/ishow/2735012015/1611126939_84828260_23512_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735012617/1611652313_84828260_14368_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020309/1612316881_84828260_16070_sProdImgNo_2.jpg/0', 'http://test.com/upload/avatar4.png', 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218025702PSiVKDB5ap.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 1, NULL, 1, NULL, NULL);
INSERT INTO `apply` VALUES (5, '黄忠', 1, 'beijing', 1, '88888888', 'http://shp.qpic.cn/ishow/2735020309/1612316927_84828260_28564_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020816/1612772942_84828260_6917_sProdImgNo_2.jpg/0,http://shp.qpic.cn/ishow/2735020816/1612773126_84828260_2178_sProdImgNo_2.jpg/0', 'http://test.com/upload/avatar5.png', 'https://stream7.iqilu.com/10339/upload_transcode/202002/18/202002181038474liyNnnSzz.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 0, NULL, 1, NULL, NULL);
INSERT INTO `apply` VALUES (6, '老夫子', 1, 'beijing', 2, '88888888', '', 'https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg', 'https://stream7.iqilu.com/10339/article/202002/18/02319a81c80afed90d9a2b9dc47f85b9.mp4', '康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程康复过程', 0, NULL, 1, NULL, NULL);
INSERT INTO `apply` VALUES (36, '王嘉林', 0, 'shanghai', 1, '15800767098', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1617984000000', 1, NULL, '');
INSERT INTO `apply` VALUES (37, '黄思睿', 1, 'hubei', 1, '187171337585', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1620576000000', 1, NULL, '');
INSERT INTO `apply` VALUES (38, '潘佳铭', 1, 'hubei', 1, '15557229302', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1620576000000', 1, NULL, '');
INSERT INTO `apply` VALUES (39, '左译哲', 1, 'jiangsu', 1, '13812889696', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (40, '李睿韬', 1, 'zhejiang', 1, '18005707508', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (41, '石煦焜', 1, 'shanghai', 1, '18621367249', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (42, '徐翊博', 1, 'hunan', 1, '13973273512', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (43, '尹梓琪', 1, 'hunan', 1, '15080756927', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (44, '李江昆', 1, 'fujian', 1, '18604858887', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');
INSERT INTO `apply` VALUES (45, '林奕', 1, 'zhejiang', 1, '13666572845', '', 'http://test.com/upload/avatar2.png', '', '', 0, '1623686400000', 1, NULL, '');

-- ----------------------------
-- Table structure for maplist
-- ----------------------------
DROP TABLE IF EXISTS `maplist`;
CREATE TABLE `maplist`  (
  `id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `num` int(255) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of maplist
-- ----------------------------
INSERT INTO `maplist` VALUES ('anhui', '安徽', 0);
INSERT INTO `maplist` VALUES ('aomen', '澳门', 0);
INSERT INTO `maplist` VALUES ('beijing', '北京', 0);
INSERT INTO `maplist` VALUES ('chongqing', '重庆', 0);
INSERT INTO `maplist` VALUES ('fujian', '福建', 0);
INSERT INTO `maplist` VALUES ('gansu', '甘肃', 0);
INSERT INTO `maplist` VALUES ('guangdong', '广东', 0);
INSERT INTO `maplist` VALUES ('guangxi', '广西', 0);
INSERT INTO `maplist` VALUES ('guizhou', '贵州', 0);
INSERT INTO `maplist` VALUES ('hainan', '海南', 0);
INSERT INTO `maplist` VALUES ('hebei', '河北', 0);
INSERT INTO `maplist` VALUES ('heilongjiang', '黑龙江', 0);
INSERT INTO `maplist` VALUES ('henan', '河南', 0);
INSERT INTO `maplist` VALUES ('hubei', '湖北', 0);
INSERT INTO `maplist` VALUES ('hunan', '湖南', 0);
INSERT INTO `maplist` VALUES ('jiangsu', '江苏', 0);
INSERT INTO `maplist` VALUES ('jiangxi', '江西', 0);
INSERT INTO `maplist` VALUES ('jilin', '吉林', 0);
INSERT INTO `maplist` VALUES ('liaoning', '辽宁', 0);
INSERT INTO `maplist` VALUES ('nanhai', '南海诸岛', 0);
INSERT INTO `maplist` VALUES ('neimenggu', '内蒙古', 0);
INSERT INTO `maplist` VALUES ('ningxia', '宁夏', 0);
INSERT INTO `maplist` VALUES ('qinghai', '青海', 0);
INSERT INTO `maplist` VALUES ('shan', '陕西', 0);
INSERT INTO `maplist` VALUES ('shandong', '山东', 0);
INSERT INTO `maplist` VALUES ('shanghai', '上海', 0);
INSERT INTO `maplist` VALUES ('shanxi', '山西', 0);
INSERT INTO `maplist` VALUES ('sichuan', '四川', 0);
INSERT INTO `maplist` VALUES ('taiwan', '台湾', 0);
INSERT INTO `maplist` VALUES ('tianjin', '天津', 0);
INSERT INTO `maplist` VALUES ('xianggang', '香港', 0);
INSERT INTO `maplist` VALUES ('xinjiang', '新疆', 0);
INSERT INTO `maplist` VALUES ('xizang', '西藏', 0);
INSERT INTO `maplist` VALUES ('yunnan', '云南', 0);
INSERT INTO `maplist` VALUES ('zhejiang', '浙江', 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tel` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `openid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `sex` int(1) NULL DEFAULT NULL COMMENT '普通用户性别，1 为男性，2 为女性',
  `province` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `country` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `headimgurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户头像，最后一个数值代表正方形头像大小（有 0、46、64、96、132 数值可选，0 代表 640*640 正方形头像）',
  `privilege` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '用户特权信息，json 数组，如微信沃卡用户为（chinaunicom）',
  `unionid` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `language` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '8888', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'b31007078ad28928823d69eadba416d1', NULL);
INSERT INTO `user` VALUES (2, '13282165320', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'e9ba024cc2d3405a84163bc624b75d0b', NULL);
INSERT INTO `user` VALUES (9, NULL, 'oSS9R6Nc8_OzPtsPTzGtnWpqfynY', '墨竹摇曳', 1, '', '', '', 'https://thirdwx.qlogo.cn/mmopen/vi_32/MWmiaQdl0QKZr0tQZ9lImzSBt2BQ5xhf2Viaqic0pPp36ILlnDl2VIlRJBHrcchyalHH7Qscm2qPbZ7Pf4gd9icRww/132', '', 'o0irm6XB4QSLL7gRRfxe6pSB-7U8', 'zh_CN', NULL, NULL);

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video`  (
  `id` int(11) NOT NULL,
  `path` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `poster` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of video
-- ----------------------------
INSERT INTO `video` VALUES (1, 'http://test.com/upload/video1.mp4', 'http://test.com/upload/video1.jpg');
INSERT INTO `video` VALUES (2, 'http://test.com/upload/video2.mp4', 'http://test.com/upload/video2.jpg');
INSERT INTO `video` VALUES (3, 'https://stream7.iqilu.com/10339/article/202002/17/4417a27b1a656f4779eaa005ecd1a1a0.mp4', NULL);
INSERT INTO `video` VALUES (4, 'https://stream7.iqilu.com/10339/upload_transcode/202002/17/20200217021133Eggh6zdlAO.mp4', NULL);

SET FOREIGN_KEY_CHECKS = 1;
