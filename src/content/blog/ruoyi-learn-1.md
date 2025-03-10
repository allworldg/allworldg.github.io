---
title: ruoyi接口权限校验
excerpt: ruoyi系统在前端主要通过权限字符包含与否来动态显示目录和按钮
publishDate: 2022-06-02T16:30:03+08:00
tags:
  - Guide
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

ruoyi系统在前端主要通过权限字符包含与否来动态显示目录和按钮。为了防止通过http请求绕过权限限制，后端接口也需要进行相关权限设计。
## @PreAuthorize使用
由于对`@PreAuthorize`原理还不够深入了解，所以此处只粗浅讲解在ruoyi项目是如何应用的。
在请求调用接口前，被`@preAuthorize`注解的接口需要首先通过验证。通过注解参数`value()`返回值`true`和`false`来判断是否有权限。
```java
public @interface PreAuthorize {  
    String value();  
}
```

Ruoyi并没有使用原生的Spel表达式，而是使用了自定义的`PermissionService`类，通过其中自定义方法`hasPermi(String Permission)` 来进行权限判断。注解使用举例：`@PreAuthorize("@ss.hasPermi('system:menu:list')")`

```java
public boolean hasPermi(String permission)  
{  
    if (StringUtils.isEmpty(permission))//用注解就必须有permission值  
    {  
        return false;  
    }  
    LoginUser loginUser = SecurityUtils.getLoginUser();  
    if (StringUtils.isNull(loginUser) ||
     CollectionUtils.isEmpty(loginUser.getPermissions()))  
    {  
        return false;  
    }  
    return hasPermissions(loginUser.getPermissions(), permission);

private boolean hasPermissions(Set<String> permissions, String permission)  
{  
    return permissions.contains(ALL_PERMISSION) ||
     permissions.contains(StringUtils.trim(permission)); //判断是否持有"所有权限”字符，或者持有该权限 
}
```

## 接口权限校验流程
粗略用两个例子来讲解前端请求如何经过后端接口权限校验。

### Login匿名请求
![](/public/ruoyi-learn-1.md/ruoyi-learn-1.md-${23-23-36}.png)

1. Login请求路径是`/login`,在过滤器链中被`AnnoymousAuthenticationFilter`添加匿名`authentication`到Spring上下文里。由于`/login`请求在`SecurityConfig.java`里设置成匿名请求，所以可以成功到达`SysLoginController`。
2. 调用`SysLoginService.login`方法，关键的一行命令：
	```java
	Authentication authentication = authenticationManager  
    .authenticate(new UsernamePasswordAuthenticationToken(username, password));
    ```
   
	`authenticationManager.authenticate()`是钩子方法，在`AbstractUserDetailsAuthenticationProvider`中实现，会根据传入的token类型来自动选择，此处`UsernamePasswordAuthenticationToken`将由`DaoAuthenticationProvider`来处理（不清楚的话可以前后打两个断点看调用栈）。

3. 在`DaoAuthenticationProvider`中可以看到关键的一行：
	```java
	UserDetails loadedUser = this.getUserDetailsService()
	.loadUserByUsername(username);
	```
	这会调用我们自定义实现的`UserDetailsServiceImpl#loadUserByUsername`方法（如流程图所示），获得user信息。至于为什么会使用自定义方法，因为在`SecurityConfig.java`中进行了配置
	```java
	@Override  
	protected void configure(AuthenticationManagerBuilder auth) throws Exception  
	{  
	    auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder());  
	}
	```

4. 生成token，然后返回。

### 已登录请求
已登录请求流程较简单，在流程图里的some filters里会通过自定义的`JwtAuthenticationFilter`,其中会通过token获得user信息，然后装入`Spring`的上下文，方便提取使用。

## 曾纠结踩坑的点
由于对SpringSecurity较陌生，虽然功能强大，但其复杂性也是大大提高，所以调试项目的同时翻看了很多入门博客文章，其中都不约而同的提到了`UsernamePasswordAuthenticationFilter`，可是我在实战项目中反复调试都没有看到这个过滤器的调用。

原因：Security配置文件需要添加`httpSecurity.formLogin()`启用表单登录才会使用该filter。查看项目使用的所有filter可以使用以下测试代码：

```java

class RuoYiApplicationTest {  
    @Autowired  
    private FilterChainProxy filterChainProxy;  
    @Test  
    public void test() {  
        List<SecurityFilterChain> filterChains = filterChainProxy.getFilterChains();  
        for(SecurityFilterChain sfc:filterChains){  
            for(Filter filter:sfc.getFilters()){  
                System.out.println(filter.getClass().getName());  
            }  
        }  
    }  
}
```
	