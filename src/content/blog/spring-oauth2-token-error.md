---
title: SpringSecurity CSRF传入正确相同的token无法登陆问题
excerpt: 前端header传入对应正确的token，但是后端依旧验证失败，返回403 error。原因为SpringSecurity5.8及以上的版本默认使用了XorCsrfTokenRequestAttributeHandler。
publishDate: 2025-02-11T09:42:56+08:00
tags:
  - Guide
  - SpringSecurity
# seo:
# image:
#   src: '/post-11.jpg'
#   alt: A person standing at the window
---

## 前因

当我根据[https://spring.io/guides/tutorials/spring-boot-oauth2](https://spring.io/guides/tutorials/spring-boot-oauth2) 教程去实现一个oauth2demo时，点击logout始终无法成功登出，报错403，但是我检查request-header中x-xsrf-token和cookie中的XSRF-TOKEN的值相同。[ https://stackoverflow.com/questions/74447118/csrf-protection-not-working-with-spring-security-6](https://stackoverflow.com/questions/74447118/csrf-protection-not-working-with-spring-security-6)最后在这个回答中得到了解决办法。

简单总结：在Spring Security 5.8及更高版本中，默认使用`XorCsrfTokenRequestAttributeHandler`匹配token，这就需要前端传入的token不能是raw token，具体解决可以参考这个文档：[https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript](https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript)

## 调试过程

如何找到该问题的源头：在`application.yml` 中增加：

```sql
logging:
  level:
    org.springframework: trace
```

debug时点击logout按钮，会发现控制台报错： `o.s.security.web.csrf.CsrfFilter: Invalid CSRF token found for http://localhost:8080/logout` 。所以我就开始一步步在`CsrfFilter`里进行调试。

根据报错信息，可以很直接的找到关键的方法为

```java
public final class CsrfFilter extends OncePerRequestFilter {
		@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
			.....
		CsrfToken csrfToken = deferredCsrfToken.get();
		String actualToken = this.requestHandler.resolveCsrfTokenValue(request, csrfToken);
		if (!equalsConstantTime(csrfToken.getToken(), actualToken)) {
			boolean missingToken = deferredCsrfToken.isGenerated();
			this.logger
				.debug(LogMessage.of(() -> "Invalid CSRF token found for " + UrlUtils.buildFullRequestUrl(request)));
			AccessDeniedException exception = (!missingToken) ? new InvalidCsrfTokenException(csrfToken, actualToken)
					: new MissingCsrfTokenException(actualToken);
			this.accessDeniedHandler.handle(request, response, exception);
			return;
		}
		filterChain.doFilter(request, response);

}
```

1. 首先之所以会打印`Invalid CSRF token found for xxx` ，是因为满足了`if (!equalsConstantTime(csrfToken.getToken(), actualToken))`的条件，随后检查发现`csrfToken.getToken()`的值正常，为Cookie里的XSRF-TOKEN。 异常的是`actualToken` 为空。
2. 所以进入上一行`String actualToken = this.requestHandler.resolveCsrfTokenValue(request, csrfToken);`的`resolveCsrfTokenValue` 方法中检查。这里注意的是，在默认配置下，这里的`requesthandler` 为 `XorCsrfTokenRequestAttributeHandler` ，所以需要进入到这个类查看该方法的实现。

   ```java
   	@Override
   	public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
   		String actualToken = super.resolveCsrfTokenValue(request, csrfToken);
   		return getTokenValue(actualToken, csrfToken.getToken());
   	}

   ```

   第一行`super.resolveCsrfTokenValue(request, csrfToken);` 调用的是父类方法，即获取request header中`X-XSRF-TOKEN` 的值，此处正常。第二行`getTokenValue(actualToken, csrfToken.getToken())` 是将Cookie提取的token值和request header的值进行比较。进入该方法进行调试可发现`actualToken` 为空的原因为满足了以下条件：

   ```java
   	private static String getTokenValue(String actualToken, String token) {
   	......
   		if (actualBytes.length != tokenSize * 2) {
   			return null;
   		}
   	....
   	}
   ```

## 解释

无论是看我开头提到总结的或是观察`CsrfFilter` 代码，会发现默认使用 `XorCsrfTokenRequestAttributeHandler` ，比较时会先进行处理（问了ai，该handler期望header传入的token的格式应该为`Base64（随机字节+（TOKEN ⊕ 随机字节))` ，所以才会有两倍长度比较的条件。而我们根据例子传入的普通原token。所以不能成功）。

## 解决

具体解决可以参考这个文档：https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html#csrf-integration-javascript，简单来说header传入的token使用`CsrfTokenRequestAttributeHandler` 处理即可。

额外提一下，解决方法中`.csrfTokenRequestHandler(new SpaCsrfTokenRequestHandler())` 这里注册自定义handler实际上是替换掉了默认的`XorCsrfTokenRequestAttributeHandler` ，具体实现是在`CsrfConfigurer.configure(H http)` 。

## 题外话

写这类的内容时，实在是很难把控内容的精细程度。一方面是写给我自己回顾，一方面也是希望能帮助到碰到相同问题的人。如果写的过细，以我自己的心性来说，我肯定是没耐心读的。如果写的太粗糙，那么又无法解决问题。所以我是以我实际如何发现，调试解决这个问题的流程进行记录的，而不是对相关代码从头到尾进行讲解。

这也让我想到另一个很常见的问题，即很多人提问如何提升自己时，说到相关优秀框架的源码读不进去。这段相同的`CsrfFilter` 代码，如果我没碰到这个问题，而是直接开始阅读，我肯定没耐心去调试，去搞懂很多细节。可能还是得多去尝试直接写一些demo，通过解决问题来学习。
