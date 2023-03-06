package com.adobe.demo.core.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Deactivate;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.Externalizer;
import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.day.cq.dam.commons.util.DamUtil;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import javax.jcr.Session;
import javax.servlet.Servlet;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * @author Lakshya Aggarwal
 */

@Component(name = "Asset Renditions Servlet", immediate = true, service = {Servlet.class}, property = {
        Constants.SERVICE_DESCRIPTION + "=" + "Asset Renditions Servlet",
        "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=" + "/bin/AssetRendition"})

public class AssetRenditionsServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private final transient Logger log = LoggerFactory.getLogger(getClass());
    private ObjectMapper mapper = new ObjectMapper();

    @Reference
    private transient ResourceResolverFactory resourceResolverFactory;

    @Reference
    private transient Externalizer externalizer;

    private static final String FAILURE = "Failure";
    private static final String imagePresetPath = "/conf/global/settings/dam/dm/presets/macros";
    private static final String videoPresetPath = "/conf/global/settings/dam/dm/presets/video/copy_of_adaptivevideoencoding/jcr:content";

    @Activate
    protected final void activate() {
        log.info("Activated AssetRenditionsServlet");
    }

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response)
            throws IOException {
        log.debug("Inside : doGet() : AssetRenditionsServlet");
        String data = FAILURE;
        String assetPath = request.getParameter("assetPath");
        PrintWriter out = response.getWriter();
        try (ResourceResolver resourceResolver = request.getResourceResolver()) {
            Session session = resourceResolver.adaptTo(Session.class);
            Resource assetResource = resourceResolver.getResource(assetPath);
            Asset asset = assetResource.adaptTo(Asset.class);
            Map<String, String> staticRenditionsMap = new HashMap<>();
            Map<String, String> dynamicRenditionsMap = new HashMap<>();
            Map<String, Map<String, String>> assetRenditionsMap = new HashMap<>();
            if(DamUtil.isImage(asset)){
                // Asset's Dynamic Renditions Map
                Resource imagePresetRes = resourceResolver.getResource(imagePresetPath);
                String domain = asset.getMetadata().get("dam:scene7Domain").toString();
                String scene7File = asset.getMetadata().get("dam:scene7File").toString();
                String assetS7Path = domain + "is/image/" + scene7File;
                
                if(imagePresetRes != null){
                    Node presetsNode = session.getNode(imagePresetPath);
                    NodeIterator itr = presetsNode.getNodes();
                    while (itr.hasNext()) {
                        Node preset = itr.nextNode();
                        if (preset != null && !preset.getPath().contains("rep:policy")) {
                            String presetName = preset.getName();
                            dynamicRenditionsMap.put(presetName, assetS7Path + "?$" + presetName + "$");
                        }
                    }
                }

                // Asset's Static Renditions Map
                Externalizer externalizer = resourceResolver.adaptTo(Externalizer.class);
                asset.getRenditions().forEach(
                    temp -> staticRenditionsMap.put(temp.getName(), externalizer.publishLink(resourceResolver, temp.getPath())));

                assetRenditionsMap.put("static", staticRenditionsMap);
                assetRenditionsMap.put("dynamic", dynamicRenditionsMap);

            } else if (DamUtil.isVideo(asset)){
                // Asset's Dynamic Renditions Map
                Resource videoPresetRes = resourceResolver.getResource(videoPresetPath);
                String domain = asset.getMetadata().get("dam:scene7Domain").toString();
                String scene7File = asset.getMetadata().get("dam:scene7File").toString();
                String assetS7Path = domain + "is/content/" + scene7File;

                if(videoPresetRes != null){
                    Node presetsNode = session.getNode(videoPresetPath);
                    NodeIterator itr = presetsNode.getNodes();
                    while (itr.hasNext()) {
                        Node preset = itr.nextNode();
                        if (preset != null && !preset.getPath().contains("rep:policy")) {
                            String presetName = preset.getName();
                            log.debug("AssetRenditionsServlet : doGet () : PresetName :: {}", presetName);
                            if(!presetName.contains("smartcrop")){
                                dynamicRenditionsMap.put(presetName, assetS7Path + "-" + preset.getProperty("width").getString() + "x"
                                 + preset.getProperty("height").getString() + "-" + preset.getProperty("videoBitrate").getString() + "k");
                            }
                        }
                    }
                }
                assetRenditionsMap.put("dynamic", dynamicRenditionsMap);
            }
            
            data = mapper.writeValueAsString(assetRenditionsMap);
        } catch (Exception e) {
            log.error("Exception : AssetRenditionsServlet : doGet () :: ", e);
        }
        out.println(data);
        out.close();
    }

    @Deactivate
    protected void deactivate() {
        log.info("Deactivated AssetRenditionsServlet");
    }

}