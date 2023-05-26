package connect.web.controller.member;

import connect.web.service.member.LoginService;
import connect.web.domain.member.MemberDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;

@Slf4j
@RestController
public class LoginCotroller {

    @Autowired LoginService loginService;



    @PostMapping("/login")
    public boolean login( @ModelAttribute MemberDto memberDto , HttpServletRequest request ) {
        log.info("login controller : " + memberDto );

        boolean result = loginService.login( memberDto );

        if( result ){
            request.getSession().setAttribute("login" , memberDto.getMemberId() );
            return true;
        }
        return false;
    }

    @GetMapping("/login")
    public MemberDto loginInfo() {
        return loginService.loginInfo();
    }

    @GetMapping("/logout")
    public boolean logout() {
        return loginService.logout();
    }

    @GetMapping("/image/{uuidFilename:.+}")
    public ResponseEntity<byte[]> getImage(@PathVariable String uuidFilename) throws IOException {

        log.info("get image controller : " + uuidFilename );

        // 파일 실제 경로 구하기
        String filePath = "C:\\java\\" + uuidFilename;
        // file 클래스 만들기
        File imageFile = new File(filePath);
        // 미디어 타입 ( 기본값 PNG )
        MediaType mediaType = MediaType.IMAGE_PNG;

        // 파일 확장자
        String filetype = uuidFilename.split("\\.")[1] ;
        log.info(filetype);

        // 만약에 파일 확장자가 PNG 가 아닌 다른 확장자일 경우
        if( filetype.equals("jpg") || filetype.equals("jpeg") ) {
            mediaType = MediaType.IMAGE_JPEG;
        } else if ( filetype.equals("gif") ) {
            mediaType = MediaType.IMAGE_GIF;
        }

        byte[] imageBytes = FileUtils.readFileToByteArray(imageFile);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType( mediaType );

        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }


}
