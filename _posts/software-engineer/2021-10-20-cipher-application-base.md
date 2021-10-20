---
layout: post
title: 密码学应用基础
date: 2021-10-20 10:00:00
tags:
- 软件安全
- 安全基础
- 密码学
keywords: 密码学,软件安全
description: 密码学应用的基础知识
background: '/img/posts/default.jpg'
---

## 概述

现代密码学是基于**密钥**安全的，密码算法都是公开的，经权威机构认证的密码算法都是安全的，所以密码体系的安全强度取决于密钥。

因此加密系统的保密性应当建立在对密钥的保密上，而不应当取决于加密算法的保密。

```txt
正向应用：
【数据】---->{通过密钥进行加密，数据签名}---->【密文】
反向应用：
【密文】---->{通过密钥进行解密，数据验证}---->【数据】
```

### 密码算法安全强度

**安全强度**是对破解密码算法或者系统所需要的工作量的一个度量，用来衡量密码算法或密码系统的安全性。

密码算法的安全强度由**算法本身**和**密钥长度**决定。

### 密码算法分类

- 机密性
  - 对称加密
    - 流加密 RC4
    - 分组加密 DES，3DES，AES
  - 非对称加密 RSA
- 完整性/认证/防抵赖
  - Hash算法 MD5，SHA-1，SHA256
  - MAC HMAC，CMAC
  - 数字签名 RSA，DSA，ECDSA
- 密钥交换 DH，ECDH

### 密码算法的选择

| 用途 | 不安全的密码算法 | 可遗留使用的 | 推荐使用的安全密码算法|
| :--: | :--: | :--: | :--: |
| 分组加密 | Blowfish, DES, DESX, RC2, 2TDEA, Skipjack, TEA, 3DES（未遵循K1!=K2!=K3） | 3DES（K1!=K2!=K3） | AES-GCM（128bits及以上） |
| 流加密 | SEAL, CYLINK_MEK, RC4（<128bits） | RC4（128bits及以上） | AES-CTR（128bits及以上），AES-OFB（128bits及以上），Chacha20 |
| 哈希算法 | SHA0, MD2, MD4,  MD5, RIPEMD, RIPEMD-128 | SHA-1 | SHA256或以上，SHA3 |
| 非对称加密 | RSA（<2048bits） | RSA（<3072bits） | RSA（3072bits及以上） |
| 数字签名 | RSA（<2048bits）, DSA（<2048bits）, ECDSA（<224bits） | RSA（<3072bits）, DSA（<3072bits）, ECDSA（<256bits） | RSA（3072bits及以上）, DSA（3072bits及以上）, ECDSA（256bits及以上） |
| 密钥交换 | DH（<2048bits）, ECDH（<224bits） | DH（<3072bits）, ECDH（<256bits） | DH（3072bits及以上）, ECDH（256bits及以上） |

## 密码算法

### 随机数

在密码算法中，随机数发挥了重要的作用，其使用场景包括：

- 产生密钥。直接作为密钥，或作为密钥协商过程中的密钥材料。
- 产生不可预测的IV。产生不可预测的初始化向量。
- 产生盐值。盐值可以有效增加攻击的难度。

【安全随机数生成器】

- Linux下的/dev/random文件
- Windows下的CryptGenRandom
- JDK的java.security.SecureRandom

## 密钥管理

## 密码协议
